import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {OrderComponent} from './components/order/order.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {AuthGuard} from './Shared/auth-guard';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {ProductListComponent} from './components/product-list-grid/product-list-grid.component';
import {ProductEditingComponent} from './components/product-editing/product-editing.component';
import {UserInfoComponent} from './components/user-info/user-info.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'user-info', component: UserInfoComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'orders', component: OrderComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartDetailsComponent},
  {path: 'product/:id', component: ProductDetailsComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'products/editing', component: ProductEditingComponent},
  {path: '', component: ProductListComponent, pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class MyAppRoutingModule {
}
