import { Component, OnInit } from '@angular/core';
import {Product} from '../../models/product';
import {CartItem} from '../../models/cart-item';
import {Order} from '../../models/order';
import {HttpService} from '../../services/http.service';



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[];
  totalPrice = 0;
  totalQuantity = 0;
  items: CartItem[] ;

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.getUserOrders();
  }
   getUserOrders() {
     this.httpService.getOrders().subscribe(orders => this.orders = orders.reverse());
  }
}
