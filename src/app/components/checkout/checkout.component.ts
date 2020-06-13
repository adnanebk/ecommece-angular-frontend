import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {CartService} from '../../services/cart.service';
import {HttpService} from '../../services/http.service';
import {Order} from '../../models/order';
import {MyError} from '../../models/my-error';
import {Router} from '@angular/router';
import {CartItem} from '../../models/cart-item';
import {ValidationService} from '../../services/validation.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice = 0;
  totalQuantity = 0;
  clientErrorEnabled = true;
  errors: MyError[] = [];
  cartItems: CartItem[];
  constructor(private formBuilder: FormBuilder, private cartService: CartService,
              private validationService: ValidationService, private httpService: HttpService,
              private router: Router) {
    this.cartItems = this.router.getCurrentNavigation().extras.state?.products;
  }
   getClientError(fieldName: string) {
  }
  get getEmail() {
    return this.checkoutFormGroup.get('email');
  }
  get getLastName() {
    return this.checkoutFormGroup.get('lastName');
  }
  get getStreet() {
    return this.checkoutFormGroup.get('street');
  }
  get getCity() {
    return this.checkoutFormGroup.get('city');
  }
  get getCountry() {
    return this.checkoutFormGroup.get('country');
  }
  ngOnInit(): void {
    this.totalQuantity = this.cartService.totalQuantity;
    this.totalPrice = this.cartService.totalPrice;
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]]
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
      }),
    });
  }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }

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

    this.errors = [];
    const myOrder = {...this.checkoutFormGroup.get('customer').value, ...this.checkoutFormGroup.get('shippingAddress').value};
    this.saveOrder(myOrder);
  }
  getErrorMessage(input: AbstractControl)
  {
   return  this.validationService.getErrorMessage(input, this.checkoutFormGroup, this.clientErrorEnabled, this.errors);
  }
 /* getErrorMessage(input) {
    const fieldName = input.getAttribute('formControlName');
    if (this.clientErrorEnabled)
    {
      input.classList.add('ng-invalid');
      for (const key of Object.keys(this.checkoutFormGroup.controls)) {
        const control = this.checkoutFormGroup.get(key).get(fieldName);
        console.log(control);
        if (control &&  (control.dirty) && control.invalid)
        {
          if (control.errors.required)
          {
           return  'this field is required';
          }
          else if (fieldName === 'email' && control.errors.email) {
            return 'email must be a valid email';
          }
        }
      }
    }
    else {
      input.classList.remove('ng-invalid');
    }
    if (this.errors.length > 0)
   {
     const err =  this.errors.find(error => error.fieldName === fieldName);
     console.log(err);
     if (err !== undefined)
     {
       input.style.border = '1px solid red';
       input.nextElementSibling?.classList.add( 'err-text');
       return err?.name + ' ' + err?.message;
     }
     else {
       input.style.border = 'none';
       input.nextElementSibling?.classList.remove( 'err-text');
     }
   }
  }*/
}
