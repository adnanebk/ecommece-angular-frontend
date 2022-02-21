import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {Observable} from "rxjs";
import {Order} from "../models/order";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderUrl = environment.path + 'userOrders';

  constructor(private httpClient: HttpClient) {

  }

  getOrders() {
    return this.httpClient.get<Order[]>(this.orderUrl);
  }

  saveOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.orderUrl, order);
  }

}

