import { Component, OnInit } from '@angular/core';
import {CartItem} from "../../../core/models/cart-item";
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../../../core/services/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalQuantity = 0;

  constructor(private activatedRoute: ActivatedRoute, private cartService: CartService, private route: Router) {
  }

  ngOnInit(): void {
    this.getCartItems();
    this.computeCartItems();
    // this.cartService.totalQuantitySubject.subscribe((data) => this.totalQuantity = data);
    // this.cartService.totalPriceSubject.subscribe((data) => this.totalPrice = data);
  }


  private getCartItems() {
    this.cartService.cart.subscribe(items => this.cartItems = items);
  }

  removeProduct(cartItem: CartItem) {
    this.cartService.removeItem(cartItem.id);
    this.computeCartItems();
  }

  increment(item: CartItem) {
    item.quantity++;
    this.computeCartItems();
  }

  decrement(item: CartItem) {
    item.quantity>1 && item.quantity--;
    this.computeCartItems();
  }


  handleCheckout() {
    this.totalPrice > 0 && this.route.navigate(['/checkout'], {state: {products: this.cartItems}});
  }

  private computeCartItems() {
    this.totalQuantity =   this.cartService.computeTotalQuantity(this.cartItems);
    this.totalPrice =   this.cartService.computeTotalPrice(this.cartItems);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id);
    this.computeCartItems();
  }
}
