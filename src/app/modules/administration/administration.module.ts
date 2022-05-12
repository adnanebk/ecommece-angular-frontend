import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {LayoutComponent} from "../../shared/layout/layout.component";
import {ProductsEditingComponent} from '../administration/products-editing/products-editing.component';
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {AdministrationComponent} from './administration/administration.component';
import {CategoriesEditingComponent} from './categories-editing/categories-editing.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'admin/products-editing', component: AdministrationComponent }
    ]
  }
];


@NgModule({
    declarations: [
        ProductsEditingComponent,
        AdministrationComponent,
        CategoriesEditingComponent
    ],
    providers : [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbAlertModule,
        SharedModule,

    ]
})
export class AdministrationModule { }
