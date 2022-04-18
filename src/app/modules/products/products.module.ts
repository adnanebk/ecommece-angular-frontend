import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import {RouterModule, Routes} from "@angular/router";
import {MatGridListModule} from "@angular/material/grid-list";
import {SharedModule} from "../../shared/shared.module";
import {LayoutComponent} from "../../shared/layout/layout.component";
import { ProductComponent } from './product/product.component';
import {NgxPaginationModule} from "ngx-pagination";


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: ProductsComponent },
    ]
  }
];

@NgModule({
  declarations: [
    ProductsComponent,
    ProductComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        MatGridListModule,
        NgxPaginationModule,

    ]
})
export class ProductsModule { }
