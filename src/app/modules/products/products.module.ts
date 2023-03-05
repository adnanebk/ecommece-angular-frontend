import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductsComponent} from './components/products.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {LayoutComponent} from "../../shared/layout/layout.component";
import {ProductDetailsComponent} from "./components/product-details/product-details.component";
import {ProductComponent} from "./components/product/product.component";
import {NgbAlertModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";


const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {path: 'products', component: ProductsComponent},
            {path: '', redirectTo: 'products'},
            {path: 'product/details/:sku', component: ProductDetailsComponent},
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
        NgbAlertModule,

    ]
})
export class ProductsModule {
}
