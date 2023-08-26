import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Order} from "../models/order";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private orderUrl = environment.api_url + 'orders';

    constructor(private httpClient: HttpClient) {

    }

    getOrders() {
        return this.httpClient.get<Order[]>(this.orderUrl);
    }

    saveOrder(order: Order): Observable<Order> {
        order.creditCard.cardNumber = order.creditCard.cardNumber?.replace(/-/g, '');

        return this.httpClient.post<Order>(this.orderUrl, order);
    }

    removeOrder(id: number) {
        return this.httpClient.delete<void>(this.orderUrl + "/" + id);
    }
}

