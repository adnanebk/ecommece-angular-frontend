import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiError} from "../../../core/models/api-error";
import {CartItem} from "../../../core/models/cart-item";
import {CartService} from "../../../core/services/cart.service";
import {CardOption, CreditCardService} from "../../../core/services/credit-card.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {CardNumberFormControl} from "../../../shared/form-controls/card-number-form-control";
import {MonthYearFormControl} from "../../../shared/form-controls/month-year-form-control";
import {Order} from "../../../core/models/order";
import {OrderService} from "../../../core/services/order.service";
import {CreditCard} from "../../../core/models/CreditCard";

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    customerForm!: FormGroup;
    creditCardForm!: FormGroup;
    error?: ApiError;
    cartItems: CartItem[] = [];
    totalQuantity: number = 0;
    totalPrice: number = 0;
    cardOptions: CardOption[] = [];
    selectedCard?: CreditCard;


    constructor(public formBuilder: FormBuilder, private cartService: CartService,
                private orderService: OrderService, private creditCardService: CreditCardService,
                private router: Router, private authService: AuthService) {
        this.getCartItems();
        this.cardOptions = this.creditCardService.getCardNames();

    }

    private getCartItems() {
        this.cartItems = this.router.getCurrentNavigation()?.extras?.state?.['cartItems'] ?? this.cartService.cart.value;
    }

    ngOnInit(): void {
        this.createCustomerForm();
        this.createCreditCardForm();
        this.authService.getAuthenticatedUser().subscribe((user) => {
            if (user) {
                this.customerForm.patchValue({
                    ...user,
                    fullName: (user.firstName + ' ' + (user.lastName || '')).trim()
                });
                this.creditCardService.getActiveCreditCard().subscribe((card) => {
                    if (card) {
                        this.selectedCard = card;
                        this.creditCardForm.patchValue({...this.selectedCard});
                    }
                });
            }

        });

        this.computeTotals();
    }

    private computeTotals() {
        if (this.cartItems?.length) {
            this.totalQuantity = this.cartService.computeTotalQuantity(this.cartItems)
            this.totalPrice = this.cartService.computeTotalPrice(this.cartItems);
        }
    }

    private createCustomerForm() {
        this.customerForm = this.formBuilder.group({
            fullName: [null, [Validators.required, Validators.minLength(4)]],
            email: [null, [Validators.email, Validators.required]],
            street: [null, [Validators.required, Validators.minLength(4)]],
            city: [null, Validators.required],
            country: [null, Validators.required]
        });
    }

    private createCreditCardForm() {
        this.creditCardForm = this.formBuilder.group({
            id: [null],
            cardType: [null, [Validators.required]],
            cardNumber: new CardNumberFormControl(null, [Validators.required]),
            expirationDate: new MonthYearFormControl(null, [Validators.required])
        });
    }

    onSubmit() {
        const myOrder: Order = {
            ...this.customerForm.getRawValue(), totalPrice: this.totalPrice,
            quantity: this.totalQuantity, orderItems: this.cartItems,
            creditCard: this.creditCardForm.getRawValue()
        };
        this.saveOrder(myOrder);
    }

    saveOrder(order: Order) {
        this.orderService.saveOrder(order).subscribe(() => {
            this.router.navigateByUrl('/orders');
        }, (error => {
            this.creditCardForm.setErrors({err: true});
            this.error = error;
        }));
    }

    getApiError(fieldName: string) {
        const error = this.error?.errors?.find(err => err.fieldName === fieldName);
        return error?.message?.includes('.')
            ? error.message.substring(error?.message.lastIndexOf('.') + 1)
            : error?.message;
    }

    isCardNumberChanged() {
        return this.selectedCard?.cardNumber !== this.creditCardForm.get('cardNumber')?.value?.replaceAll('-', '');
    }

    hasCreditCardErrors() {
        return this.error?.errors?.some(err => err.fieldName.includes('creditCard'));
    }

    hasCustomerCardErrors() {
        return this.error?.errors?.some(err => !err.fieldName.includes('.'));
    }

    public get errors() {
        return this.error?.errors || [];
    }
}
