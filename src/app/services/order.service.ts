import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {Observable} from "rxjs";
import {Order} from "../models/order";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderUrl = environment.path+ + 'userOrders';

  constructor(private httpClient: HttpClient) {

  }

  getOrders(userName: string): Observable<Order[]> {
    return this.httpClient.get<PagedResponse>(this.orderUrl + '/search/byUserName?userName=' + userName).pipe(
      map(response => response._embedded.userOrders));
  }

  saveOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.orderUrl, order);
  }

}
interface PagedResponse {
  _embedded: any;
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
}
