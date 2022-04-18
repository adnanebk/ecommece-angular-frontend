import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {CartItem} from "../models/cart-item";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
   cartSize = new BehaviorSubject<number>(0);
   cart = new BehaviorSubject<CartItem[]>([]);

  constructor() {
  this.loadCart();
  }


  addToCart(newItem: CartItem) {
     let existingItem = this.items.find(it => it.id === newItem.id);
    if (!existingItem){
      this.items.push(newItem);
      this.updateCart();
    }
    else
      existingItem.quantity = newItem.quantity;
    this.saveCart();
  }

  private updateCart() {
    this.cartSize.next(this.items.length);
    this.cart.next(this.items);
  }
  removeItem(id: number) {
    this.items = this.items.filter(p => p.id !== id);
    this.updateCart();
    this.saveCart();
  }

  private saveCart() {
    localStorage.setItem('CartItems', JSON.stringify(this.items));
  }

  private loadCart() {
    const jsonCartItems = localStorage.getItem('CartItems');
    if (this.items.length === 0 && jsonCartItems) {
      this.items = JSON.parse(jsonCartItems);
      this.updateCart();
    }
  }


  computeTotalQuantity() {
    return this.items.reduce((prev,current) => prev+current.quantity,0);
  }

  computeTotalPrice() {
    return this.items.reduce((prev,current) => prev+(current.unitPrice*current.quantity),0);
  }
}
