import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiError} from "../../../core/models/api-error";
import {CartItem} from "../../../core/models/cart-item";
import {CartService} from "../../../core/services/cart.service";
import {CreditCardService} from "../../../core/services/credit-card.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {Order} from "../../../core/models/order";
import {OrderService} from "../../../core/services/order.service";
import {CreditCard} from "../../../core/models/CreditCard";
import {CreditCardFormComponent} from "../credit-cards/credit-card-form/credit-card-form.component";
import {MatStepper} from "@angular/material/stepper";

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit,AfterViewInit {

    customerForm!: FormGroup;
    creditCardForm!: FormGroup;
    cartItems: CartItem[] = [];
    totalQuantity: number = 0;
    totalPrice: number = 0;
    selectedCard?: CreditCard;
    @ViewChild(CreditCardFormComponent) creditCardComponent!: CreditCardFormComponent;
    @ViewChild(MatStepper) stepper!:MatStepper;


    constructor(public formBuilder: FormBuilder, private cartService: CartService,
                private orderService: OrderService, private creditCardService: CreditCardService,
                private router: Router, private authService: AuthService) {
        this.getCartItems();
    }

    ngAfterViewInit(): void {
        this.creditCardForm=this.creditCardComponent?.cardForm;
        this.hasCreditCardErrors();
    }

    private getCartItems() {
        this.cartItems = this.router.getCurrentNavigation()?.extras?.state?.['cartItems'] ?? this.cartService.cart.value;
    }

    ngOnInit(): void {
        this.createCustomerForm();
        this.authService.getAuthenticatedUser().subscribe((user) => {
            if (user) {
                this.customerForm.patchValue({
                    ...user,
                    fullName: (user.firstName + ' ' + (user.lastName || '')).trim()
                });
                this.creditCardService.getActiveCreditCard().subscribe((card) => {
                    if (card) {
                        this.selectedCard = card;
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


    onSubmit() {
        const myOrder: Order = {
            ...this.customerForm.getRawValue(), totalPrice: this.totalPrice,
            quantity: this.totalQuantity, orderItems: this.cartItems,
            creditCard: this.creditCardForm?.getRawValue()
        };
        this.saveOrder(myOrder);
    }

    saveOrder(order: Order) {
        this.orderService.saveOrder(order).subscribe(() => {
            this.router.navigateByUrl('/orders');
        }, (error => {
            this.setErrors(error);
        }));
    }
    
    hasCreditCardErrors() {
          this.creditCardForm?.valueChanges.subscribe(()=>{
              if(this.creditCardForm.errors)
              {
                  this.stepper.steps.get(0)?.select();
              }
          });
          
    }
    private setErrors(error: ApiError) {
        error.errors?.forEach(err => {
              this.creditCardForm?.setErrors({[err.fieldName]: err.message});
              this.stepper.steps.get(1)?.select();
              
        })
    }


}
