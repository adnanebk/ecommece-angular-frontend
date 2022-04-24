import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductsComponent} from './products.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {LayoutComponent} from "../../shared/layout/layout.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {ProductComponent} from "./product/product.component";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'products', component: ProductsComponent },
      { path: '',redirectTo : 'products' },
      { path: 'product/details/:sku',component: ProductDetailsComponent},
    ]
  }
];


@NgModule({
    declarations: [
        ProductsComponent,
        ProductDetailsComponent,
        ProductComponent
    ],

    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        NgbPaginationModule,

    ]
})
export class ProductsModule { }
