import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css']
})
export class MyCartComponent implements OnInit {
  totalQuantity = 0;
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.totalQuantitySubject.subscribe((data) => this.totalQuantity = data);
    this.cartService.totalPriceSubject.subscribe((data) => this.total = data);
    this.cartService.loadMyCart();
  }

}
