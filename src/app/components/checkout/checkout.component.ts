import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CartService} from '../../services/cart.service';
import {HttpService} from '../../services/http.service';
import {Order} from '../../models/order';
import {MyError} from '../../models/my-error';
import {Router} from '@angular/router';
import {CartItem} from '../../models/cart-item';
import {AuthService} from '../../services/auth.service';
import {AppUser} from '../../models/app-user';
import {MonthYearFormControl} from '../../Shared/month-year-form-control';
import {CardNumberFormControl} from '../../Shared/card-number-form-control';
import {CreditCard} from '../../models/CreditCard';


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
  cartItems: CartItem[] = [];
  userCard: CreditCard;

  constructor(private formBuilder: FormBuilder, private cartService: CartService,
              private httpService: HttpService, private router: Router, private authService: AuthService) {
    this.cartItems = this.router.getCurrentNavigation().extras.state?.products;
  }

  ngOnInit(): void {
    this.authService.userSubject.subscribe((user) => {
      this.user = user;
    });
    this.httpService.getCreditCardInfo(this.user.userName).subscribe((cards) => {
      this.userCard = cards[0];
      this.checkoutFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group({
          fullName: [this.user?.firstName + ' ' + this.user?.lastName, [Validators.required, Validators.minLength(2)]],
          email: [this.user?.email, [Validators.email, Validators.required]]
        }),
        shippingAddress: this.formBuilder.group({
          street: ['', [Validators.required, Validators.minLength(4)]],
          city: ['', Validators.required],
          country: ['', Validators.required]
        }),
        creditCard: this.formBuilder.group({
          cardType: [this.userCard?.cardType, [Validators.required]],
          cardNumber: new CardNumberFormControl(this.userCard?.cardNumber, [Validators.required]),
          expirationDate: new MonthYearFormControl(this.userCard?.expirationDate, [Validators.required])
        })
      });

    });

    if (this.cartItems?.length > 1) {
      this.totalQuantity = this.cartService.totalQuantity;
      this.totalPrice = this.cartService.totalPrice;
    } else if (this.cartItems?.length === 1) {
      this.totalQuantity = this.cartItems[0].quantity;
      this.totalPrice = this.cartItems[0].quantity * this.cartItems[0].unitPrice;
    }

  }


  saveOrder(order: Order) {
    order.orderItems = this.cartItems;
    order.quantity = this.totalQuantity;
    order.id = 0;
    order.totalPrice = this.totalPrice;
    this.httpService.saveOrder(order).subscribe(next => {
      this.router.navigateByUrl('/orders');
    }, (errors => {
      if (Array.isArray(errors)) {
        this.errors = errors;
      }
    }));
  }

  onSubmit() {
    this.checkoutFormGroup.clearValidators();
    this.checkoutFormGroup.markAsPristine();
    this.errors = [];
    const myOrder: Order = {
      ...this.checkoutFormGroup.get('customer').value,
      ...this.checkoutFormGroup.get('shippingAddress').value
    };
    let creditCard = this.checkoutFormGroup.get('creditCard').value;
    creditCard.cardNumber = creditCard?.cardNumber?.replaceAll('-', '');
    myOrder.creditCard = creditCard;

    this.saveOrder(myOrder);
  }




  handleChange() {
    this.errors = null;
  }
}
