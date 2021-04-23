import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ProductListComponent} from './components/product-list-grid/product-list-grid.component';
import {HttpService} from './services/http.service';
import {RouterModule, Routes} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {ProductCategoryComponent} from './components/product-category/product-category.component';
import {ProductSearchComponent} from './components/product-search/product-search.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MyCartComponent} from './components/my-cart/my-cart.component';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MyInterceptor} from './services/my.interceptor';
import {OrderComponent} from './components/order/order.component';
import {InputComponent} from './Shared/input/input.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './Shared/auth-guard';
import {EditableTableComponent} from './Shared/editable-table/editable-table.component';
import {ProductEditingComponent} from './components/product-editing/product-editing.component';
import {CommonModule, DatePipe} from '@angular/common';
import {CategoryEditingComponent} from './components/category-editing/category-editing.component';
import {ToastrModule} from 'ngx-toastr';
import {ConfirmComponent} from './Shared/confirm/confirm.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'orders', component: OrderComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartDetailsComponent},
  {path: 'product/:id', component: ProductDetailsComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'products/editing', component: ProductEditingComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ConfirmComponent,
    ProductCategoryComponent,
    ProductSearchComponent,
    ProductDetailsComponent,
    MyCartComponent,
    CartDetailsComponent,
    CheckoutComponent,
    OrderComponent,
    InputComponent,
    RegisterComponent,
    LoginComponent,
    EditableTableComponent,
    ProductEditingComponent,
    CategoryEditingComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    /*    TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })*/
  ],
  providers: [HttpService, {provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true}, AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
