import {Component, OnInit} from '@angular/core';
import {CartItem} from '../../models/cart-item';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number;
  totalQuantity: number;

  constructor(private activatedRoute: ActivatedRoute, private cartService: CartService, private route: Router) {
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.items;
    this.totalQuantity = this.cartService.totalQuantity;
    this.totalPrice = this.cartService.totalPrice;
    this.cartService.totalQuantitySubject.subscribe((data) => this.totalQuantity = data);
    this.cartService.totalPriceSubject.subscribe((data) => this.totalPrice = data);
  }


  removeProduct(cartItem: CartItem) {
    this.cartItems = this.cartService.removeItem(cartItem);
  }

  increment(item: CartItem) {
    this.cartService.increment(item);
  }

  decrement(item: CartItem) {
    this.cartService.decrement(item);
  }

  handleQuantityChange(item: CartItem, quantity: number) {
    this.cartService.QuantityChanged(item, quantity);
  }

  handleCheckout() {
    this.totalPrice > 0 && this.route.navigate(['/checkout'], {state: {products: this.cartItems}});
  }
}
