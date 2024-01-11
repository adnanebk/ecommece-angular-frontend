import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ProductsComponent} from './components/products.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {ProductDetailsComponent} from "./components/product-details/product-details.component";
import {ProductComponent} from "./components/product/product.component";
import {NgbAlertModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";


const routes: Routes = [
    
            {path: '', component: ProductsComponent},
            {path: 'details/:sku', component: ProductDetailsComponent}
    
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
        NgOptimizedImage,

    ]
})
export class ProductsModule {
}
