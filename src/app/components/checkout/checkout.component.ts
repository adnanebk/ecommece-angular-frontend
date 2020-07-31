import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {CartService} from '../../services/cart.service';
import {HttpService} from '../../services/http.service';
import {Order} from '../../models/order';
import {MyError} from '../../models/my-error';
import {Router} from '@angular/router';
import {CartItem} from '../../models/cart-item';
import {AuthService} from '../../services/auth.service';
import {AppUser} from '../../models/app-user';
import {MonthYearFormControl} from '../../Shared/month-year-form-control';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice = 0;
  totalQuantity = 0;
  user: AppUser;
  errors: MyError[] = [];
  cartItems: CartItem[];
  constructor(private formBuilder: FormBuilder, private cartService: CartService,
              private httpService: HttpService, private router: Router, private authService: AuthService) {
    this.cartItems = this.router.getCurrentNavigation().extras.state?.products;
  }

  ngOnInit(): void {
    this.authService.userSubject.subscribe((user) => {
      this.user = user;
    });
    if (this.cartItems?.length > 1)
    {
      this.totalQuantity = this.cartService.totalQuantity;
      this.totalPrice = this.cartService.totalPrice;
    }
    else {
      this.totalQuantity = this.cartItems[0].quantity;
      this.totalPrice = this.cartItems[0].quantity * this.cartItems[0].unitPrice;
    }

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [this.user?.firstName, [Validators.required, Validators.minLength(2)]],
        lastName: [this.user?.lastName, [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.email, Validators.required]]
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required, Validators.minLength(4)]],
        city: ['', Validators.required],
        country: ['', Validators.required]
      }),
     creditCard: this.formBuilder.group({
       cardType: [''],
       cardNumber : [''],
       expirationDate: new MonthYearFormControl('')
     })
    });
  }


saveOrder(order: Order) {
    order.orderItems = this.cartItems;
    order.quantity = this.totalQuantity;
    order.id = 0;
    order.totalPrice = this.totalPrice;
    this.httpService.saveOrder(order).subscribe( next => {
      this.router.navigateByUrl('/orders');
    } , (errors => {
      this.errors = errors;
    }));
}

  onSubmit() {
    this.checkoutFormGroup.clearValidators();
    this.checkoutFormGroup.markAsPristine();
    this.errors = [];
    const myOrder = {...this.checkoutFormGroup.get('customer').value, ...this.checkoutFormGroup.get('shippingAddress').value};
    console.log(myOrder);
    this.saveOrder(myOrder);
  }
/*  getErrorMessage(input: AbstractControl)
  {
   return  this.validationService.getErrorMessage(input, this.checkoutFormGroup, this.clientErrorEnabled, this.errors);
  }*/
  getError(fieldName: string) {
    const error = this.errors.find(er => er.fieldName === fieldName);
    return error && error.name + ' ' + error.message;
  }
}
