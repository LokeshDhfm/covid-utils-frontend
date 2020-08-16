import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from 'src/app/common/shared/interfaces/customer';
import { HttpApiService } from 'src/app/core/services/http-api.service';
import { Order } from 'src/app/common/shared/interfaces/order';
import { Product } from 'src/app/common/shared/interfaces/product';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { async } from 'rxjs/internal/scheduler/async';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertServiceService } from 'src/app/core/services/alert-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class HomeComponent implements OnInit {


  @ViewChild('form', { static: false }) form;

  protected displayedColumns: String[] = ['name', 'sellingPrice', 'quantity', 'amount', 'remove']
  protected title = 'covid utils';
  protected customers: Customer[];
  protected products: Product[];
  protected order: {
    customerId: Number;
    products: Map<String, Number>;
    paid: Boolean;
  } = {
      customerId: 0,
      products: new Map<String, Number>(),
      paid: false
    };
  protected message: String;
  protected quantError: Boolean = false;
  // protected customerFormControls = new FormControl('',Validators.required)
  maxQuantity: number;

  protected orderedProducts: Map<Product, Number> = new Map<Product, Number>();

  protected orderGroup = this.fb.group({
    customerName: new FormControl(null, Validators.required),
    productName: new FormControl(null, Validators.required),
    quantity: new FormControl(null, [Validators.min(1), Validators.max(this.maxQuantity), Validators.required]),
    paid: new FormControl(this.order.paid)
  });
  // dataSource = new MatTableDataSource<Map<Product,Number>>(this.orderedProducts);

  constructor(private apiService: HttpApiService, private alerService: AlertServiceService, private fb: FormBuilder, private router: Router) { }

  async ngOnInit() {

    this.apiService.get<Customer[]>('user').subscribe((response) => this.customers = response, (error) => this.alerService.alert(error.error.error.message, 3000));
    this.apiService.get<Product[]>('product').subscribe((response) => this.products = response);
  }
  changeMessage(event: MatSelectChange, product: Product) {
    if (event.source.selected) {
      this.message = 'available =' + product.quantity;
      console.log('available = ' + product.quantity);
      this.maxQuantity = Number(product.quantity);
      this.quantError = this.orderGroup.get('quantity').value > this.maxQuantity
    }
  }
  addProduct() {
    if (this.quantError) {
      return;
    }
    const product = this.orderGroup.controls['productName'].value;
    const quantity = this.orderGroup.controls['quantity'].value;
    if (product === null || quantity === null || quantity === 0 ) {
      return;
    }
    Object.keys(this.orderGroup.controls).forEach((control)=>{
      if(control === 'productName' || control === 'quantity'){
        this.orderGroup.get(control).reset('');
        this.orderGroup.get(control).clearValidators();
        this.orderGroup.get(control).updateValueAndValidity();
      }
    })
    // console.log(product, quantity);
    this.orderedProducts.set(product, quantity);
    // console.log(this.orderedProducts);
    this.order.products.set(String(product.id), quantity);
    // console.log(this.order)
    this.message=''
  }

  getTotalCost() {
    var total: number = 0;
    this.orderedProducts.forEach((value, key) => {
      total += Number(key.sellingPrice) * Number(value);
    })
    return total;
  }

  placeOrder(form, stepper) {
    if (this.order.customerId === 0 || this.order.products.size === 0) {
      this.alerService.alert('error in form', 3000);
      return;
    }
    this.order.products.forEach((value, key) => {
      this.order.products[`${key}`] = value;
    })
    console.log(JSON.stringify(this.order));
    this.apiService.post<Order, any>('order/', this.order).subscribe((response) => {
      console.log(response);
      this.alerService.alert('order successful', 3000);
      form.resetForm();
      stepper.reset();
    },(error)=>this.alerService.alert(error.error.error.message,3000));
    this.order.customerId = 0;
    this.order.paid = false;
    this.order.products = new Map<String, Number>();
    console.log(this.order);


    this.orderedProducts.clear();
    this.message = '';
    this.reload();
  }
  reload() {
    console.log('abcd reloading')
    this.router.navigateByUrl('/order/paid', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/']);
    });
  }

}


