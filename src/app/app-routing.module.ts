import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import {AdminAuthGuard} from "./core/guards/admin-auth.guard";

const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule),
  },
  {
    path: 'shopping-cart',
    loadChildren: () => import('./modules/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule),
  },
  {
    path: '',
    loadChildren: () => import('./modules/administration/administration.module').then(m => m.AdministrationModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./modules/payement/payement.module').then(m => m.PayementModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'account',
    loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
