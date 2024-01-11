import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreditCardsComponent} from './credit-cards/credit-cards.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {CreditCardComponent} from './credit-cards/credit-card/credit-card.component';
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {MascTextPipe} from "../../shared/pipes/mascText.pipe";
import {CheckoutComponent} from "./checkout/checkout.component";
import {MatStepperModule} from "@angular/material/stepper";
import {OrdersComponent} from './orders/orders.component';
import {CreditCardFormComponent} from "./credit-cards/credit-card-form/credit-card-form.component";


const routes: Routes = [
            {path: 'payment-info', component: CreditCardsComponent},
            {path: 'checkout', component: CheckoutComponent},
            {path: 'orders', component: OrdersComponent}
];

@NgModule({
    declarations: [
        CreditCardsComponent,
        CreditCardFormComponent,
        CreditCardComponent,
        CheckoutComponent,
        MascTextPipe,
        OrdersComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        NgbAlertModule,
        MatStepperModule,
    ]
})
export class PayementModule {
}
