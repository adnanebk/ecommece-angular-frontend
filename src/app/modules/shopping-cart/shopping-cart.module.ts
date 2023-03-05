import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";

import {CartComponent} from './cart/cart.component';
import {LayoutComponent} from "../../shared/layout/layout.component";


const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {path: '', component: CartComponent},
        ]
    }
];

@NgModule({
    declarations: [
        CartComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),

    ]
})
export class ShoppingCartModule {
}
