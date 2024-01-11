import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {ProductsEditingComponent} from './components/products-editing/products-editing.component';
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {AdministrationComponent} from './components/administration.component';
import {CategoriesEditingComponent} from './components/categories-editing/categories-editing.component';


const routes: Routes = [
    {path: 'products-editing', component: AdministrationComponent}
];


@NgModule({
    declarations: [
        ProductsEditingComponent,
        AdministrationComponent,
        CategoriesEditingComponent
    ],
    providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbAlertModule,
        SharedModule,

    ]
})
export class AdministrationModule {
}
