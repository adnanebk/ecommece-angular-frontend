import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {LayoutComponent} from "../../shared/layout/layout.component";
import { ProductsEditingComponent } from '../administration/products-editing/products-editing.component';
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'admin/products-editing', component: ProductsEditingComponent }
    ]
  }
];


@NgModule({
    declarations: [
        ProductsEditingComponent
    ],

    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        NgbAlertModule,

    ]
})
export class AdministrationModule { }
