import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaidComponent } from './paid/paid.component';
import { UnpaidComponent } from './unpaid/unpaid.component';
import { OrderMergedComponent } from './order-merged/order-merged.component';


const routes: Routes = [
  {
    path: 'paid',
    component: PaidComponent,
  },{
    path: 'unpaid',
    component: UnpaidComponent
  },
  {
    path: '',
    component: OrderMergedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
