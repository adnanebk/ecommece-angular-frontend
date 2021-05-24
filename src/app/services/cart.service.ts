import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {CartItem} from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: CartItem[] = [];
  ExistingItem: CartItem;
  totalPriceSubject: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantitySubject: Subject<number> = new BehaviorSubject<number>(0);
  totalPrice: number;
  totalQuantity: number;

  constructor() {
    this.totalPriceSubject.next(0);
    this.totalQuantitySubject.next(0);
  }

  addToCart(newItem: CartItem) {
    this.ExistingItem = this.items.find(it => it.productId === newItem.productId);
    if (!this.ExistingItem) {
      this.items.push(newItem);
    } else {
      this.items.map(it => {
        if (it.productId === newItem.productId) {
          it.quantity = it.quantity + newItem.quantity;
          return it;
        }
      });
    }
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

  refreshCart() {
    this.updateMyCart();
    localStorage.setItem('CartItems', JSON.stringify(this.items));
  }

  loadMyCart() {
    if (this.items.length === 0 && localStorage.getItem('CartItems')) {
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
    if (item.quantity > 1) {
      item.quantity--;
      this.refreshCart();
    }
  }

  QuantityChanged(item: CartItem, quantity: number) {
    item.quantity = quantity;
    this.refreshCart();
  }


}
