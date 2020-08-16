import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AppComponent } from './app.component';
import { IntegratedComponent } from './integrated/integrated.component';


const routes: Routes = [
  {
    path: 'order',
    loadChildren: () => import('./features/order/order.module').then((m) => m.OrderModule)
  },
  {
    path: '',
    component: IntegratedComponent
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
