import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpApiService } from '../core/services/http-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Product } from '../common/shared/interfaces/product';
import { AlertServiceService } from '../core/services/alert-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit {

  protected productForm = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    actualPrice: new FormControl('', Validators.required),
    sellingPrice: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required)
  });
  // @ViewChild('productForm',{static: false}) productSaveForm;
  constructor(private apiService: HttpApiService, private alertService: AlertServiceService,
              private formBuilder: FormBuilder, private router: Router) { }

  protected productTypes: String[] = [];

  ngOnInit() {
    this.apiService.get<String[]>('product/types').subscribe((response) => this.productTypes = response);
  }
  get controls() {
    return this.productForm.controls;
  }
  addProduct(form) {
    if (!this.productForm.valid) {
      // console.log('error is there');
      return;
    }
    const product = {
      'name': this.controls.name.value,
      'actualPrice': this.controls.actualPrice.value,
      'sellingPrice': this.controls.sellingPrice.value,
      'type': this.controls.type.value,
      'quantity': this.controls.quantity.value
    }
    console.log(this.controls.type);
    this.apiService.post<Product>('product', product).subscribe((response) => {
      form.resetForm();
      this.alertService.alert('added product ' + response.name + ' successfully', 3000);
      // this.productForm.markAllAsTouched()
      this.reload();
    }, (error) => {
      console.log(error.error.message);
      this.alertService.alert(error.error.message, 3000);
    });
    // window.location.reload();
  }
  reload() {
    console.log('abcd reloading')
    this.router.navigateByUrl('/order/paid', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/']);
    });
  }
}
