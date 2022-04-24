import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../core/services/order.service";
import {AuthService} from "../../../core/services/auth.service";
import {Order} from "../../../core/models/order";
import {AppUser} from "../../../core/models/app-user";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[]=[];
  user!: AppUser;

  constructor(private orderService: OrderService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getAuthenticatedUser().subscribe((user) => {
      this.user = user!;
      this.getUserOrders();
    });

  }

  getUserOrders() {
    if (this.user) {
      this.orderService.getOrders().subscribe(orders => this.orders = orders.reverse());
    }
  }

  removeOrder(order: Order, index: number) {
        this.orderService.removeOrder(order.id).subscribe(()=>this.orders.splice(index,1));
    }
}
