import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ProductListComponent} from './components/product-list-grid/product-list-grid.component';
import {HttpService} from './services/http.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ProductCategoryComponent} from './components/product-category/product-category.component';
import {ProductSearchComponent} from './components/product-search/product-search.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MyCartComponent} from './components/my-cart/my-cart.component';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MyInterceptor} from './services/my.interceptor';
import {OrderComponent} from './components/order/order.component';
import {AppInputComponent} from './Shared/input/app-input.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './Shared/auth-guard';
import {EditableTableComponent} from './Shared/editable-table/editable-table.component';
import {ProductEditingComponent} from './components/product-editing/product-editing.component';
import {CommonModule, DatePipe} from '@angular/common';
import {CategoryEditingComponent} from './components/category-editing/category-editing.component';
import {ToastrModule} from 'ngx-toastr';
import {ConfirmComponent} from './Shared/confirm/confirm.component';
import {MyAppRoutingModule} from './my-app-routing.module';
import {AuthModule} from './components/login/auth.module';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
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
    AppInputComponent,
    EditableTableComponent,
    ProductEditingComponent,
    CategoryEditingComponent,
    UserInfoComponent,
  ],
  imports: [
    MyAppRoutingModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    AuthModule,
    NgSelectModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true}, AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
