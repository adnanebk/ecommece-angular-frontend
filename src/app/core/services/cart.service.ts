import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {CartItem} from "../models/cart-item";
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  cartSize = new BehaviorSubject<number>(0);
  cart = new BehaviorSubject<CartItem[]>([]);

  constructor(private notificationService:NotificationService) {
    this.loadCart();
  }


  addToCart(newItem: CartItem) {
    let existingItem = this.items.find(it => it.id === newItem.id);
    if (!existingItem){
      this.items.push(newItem);
      this.updateCart();
      this.notificationService.openSnackBar("a new item has been added to your cart !")
    }
    else{
      existingItem.quantity = newItem.quantity;
      this.notificationService.openSnackBar(" this item has already been added to your cart !")
    }
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


  computeTotalQuantity(cartItems: CartItem[]) {
    return cartItems.reduce((prev, current) => prev+current.quantity,0);
  }

  computeTotalPrice(cartItems: CartItem[]) {
    return  cartItems.reduce((prev,current) => prev+(current.unitPrice*current.quantity),0);
  }
}
