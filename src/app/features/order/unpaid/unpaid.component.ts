import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/common/shared/interfaces/order';
import { HttpApiService } from 'src/app/core/services/http-api.service';
import { OrderModule } from '../order.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Product } from 'src/app/common/shared/interfaces/product';
import { AlertServiceService } from 'src/app/core/services/alert-service.service';

@Component({
  selector: 'app-unpaid',
  templateUrl: './unpaid.component.html',
  styleUrls: ['./unpaid.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class UnpaidComponent implements OnInit {

  isLastRow = (data, index) => index === this.unpaidOrders.length;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  protected expandedRow: Order | null;
  protected unpaidOrders: Order[] = [];
  displayedColumns: string[] = ['id', 'name','date','totalPrice','payment-status'];
  dataSource: MatTableDataSource<Order>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  productDetails: Map<Product, Number> = new Map<Product, Number> ();
  constructor(
    private apiService: HttpApiService,
    private alertService: AlertServiceService
  ) {

  }

  ngOnInit() {
    this.apiService.get<Order[]>('order/payment/false').subscribe((response)=>{
      this.unpaidOrders = response;
      // console.log(response);
      this.dataSource = new MatTableDataSource(this.unpaidOrders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (order, key) => {
        const dataStr =JSON.stringify(order).toLowerCase();
        return dataStr.indexOf(key.toLowerCase()) != -1
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log(this.dataSource)
  }

  getProductsOfOrder(id: number) {
    this.productDetails.clear()
    this.apiService.get<Map<String,Number>>('order/details/'+id).subscribe((response) => {
      Object.keys(response).forEach((key) => {
        const prod: Product = JSON.parse(key);
        this.productDetails.set(prod,response[key]);
      })
    },(error)=> this.productDetails = new Map<Product,Number>())
  }
  calculateTotal(){
    var total: number = 0;
    this.productDetails.forEach((value, key) => {
      total += Number(key.sellingPrice) * Number(value);
    })
    return total;
  }

  calculateDue(){
    var total: number = 0;
    this.dataSource.filteredData.forEach((order) => {
      total += Number(order.totalPrice);
    })

    return total;
  }

  changePaymentStatus(orderId: Number){
    this.apiService.post<Order>('order/changePayment/'+orderId+'/'+true,null).subscribe((response)=>{
      this.ngOnInit()
      this.alertService.alert('Payment Status Successfully Changed to "Paid"', 5000);
    }, (error) =>{
      this.alertService.alert('Cannot change Payment Status', 8000)
    })
  }
}
