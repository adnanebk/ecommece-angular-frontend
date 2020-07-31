import { Injectable } from '@angular/core';
import {Product} from '../models/product';
import {Subject} from 'rxjs';
import {CartItem} from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: CartItem[] = [];
  ExistingItem: CartItem;
  totalPriceSubject: Subject<number> = new Subject<number>();
  totalQuantitySubject: Subject<number> = new Subject<number>();
   totalPrice: number;
   totalQuantity: number;
  constructor() {
  }

  addToCart(newItem: CartItem ) {
    if (this.items !== undefined && this.items.length > 0)
    {
      this.ExistingItem = this.items.find(it => it.productId === newItem.productId);
      if ( this.ExistingItem === undefined)
      {
        this.items.push(newItem);
      }
      else
      {
        this.items.map(it => {
          if (it.productId === newItem.productId)
          {
            it.quantity = it.quantity + newItem.quantity;
            return it;
          }
        });
      }
    }
    else { this.items.push(newItem); }
    this.refreshCart();
  }

   private updateMyCart() {
     this.totalPrice = 0;
     this.totalQuantity = 0;
     this.items.forEach(it => {
      this.totalPrice += (it.unitPrice * it.quantity);
      this.totalQuantity += it.quantity;
    });
     this.totalPriceSubject.next(this.totalPrice);
     this.totalQuantitySubject.next(this.totalQuantity);
  }
  refreshCart(){
    this.updateMyCart();
    localStorage.setItem('CartItems', JSON.stringify(this.items) );
  }
  loadMyCart(){
    if (localStorage.length > 0) {
      this.items = JSON.parse(localStorage.getItem('CartItems'));
      this.updateMyCart();
    }
  }

  removeItem(cartItem: CartItem) {
    this.items = this.items.filter(p => p.productId !== cartItem.productId);
    this.refreshCart();
    return this.items;
  }

  increment(item: CartItem) {
      item.quantity++;
      this.refreshCart();
  }

  decrement(item: CartItem) {
    if (item.quantity > 1)
    {
      item.quantity--;
      this.refreshCart();
    }
  }

  QuantityChanged(item: CartItem, quantity: number) {
      item.quantity = quantity;
      this.refreshCart();
  }


}
