import {Component, Input, OnInit} from '@angular/core';
import {CartService} from "../../../core/services/cart.service";
import {Product} from "../../../core/models/product";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent  {

  @Input() product!: Product;

  constructor(private cartService: CartService ) { }


  // Add to cart
  addToCart() {
    const {name,image,unitPrice,id} = this.product;
    const quantity = 1;
    this.cartService.addToCart({id,name,image,unitPrice,quantity});
  }



}
