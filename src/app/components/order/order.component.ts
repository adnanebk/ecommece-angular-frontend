import {Component, OnInit} from '@angular/core';
import {Order} from '../../models/order';
import {AuthService} from '../../services/auth.service';
import {AppUser} from '../../models/app-user';
import {OrderService} from "../../services/order.service";


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[];
  user: AppUser;

  constructor(private orderService: OrderService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.userSubject.subscribe((user) => {
      this.user = user;
    });
    this.getUserOrders();
  }

  getUserOrders() {

    if (this.user) {
      this.orderService.getOrders(this.user.userName).subscribe(orders => this.orders = orders.reverse());
    }
  }
}
