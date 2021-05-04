import {Component, OnInit} from '@angular/core';
import {Product} from '../../models/product';
import {CartItem} from '../../models/cart-item';
import {Order} from '../../models/order';
import {HttpService} from '../../services/http.service';
import {AuthService} from '../../services/auth.service';
import {AppUser} from '../../models/app-user';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[];
  user: AppUser;

  constructor(private httpService: HttpService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.userSubject.subscribe((user) => {
      this.user = user;
    });
    this.getUserOrders();
  }

  getUserOrders() {

    if (this.user) {
      this.httpService.getOrders(this.user.userName).subscribe(orders => this.orders = orders.reverse());
    }
  }
}
