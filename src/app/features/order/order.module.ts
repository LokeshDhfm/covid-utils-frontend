import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { PaidComponent } from './paid/paid.component';
import { UnpaidComponent } from './unpaid/unpaid.component';
import { MaterialModule } from 'src/app/common/material/material.module';
import { OrderMergedComponent } from './order-merged/order-merged.component';


@NgModule({
  declarations: [PaidComponent, UnpaidComponent, OrderMergedComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    MaterialModule
  ]
})
export class OrderModule { }
