import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CartItem} from '../../models/cart-item';
import {CartService} from '../../services/cart.service';
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  cartItem: CartItem;

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private cartService: CartService, private route: Router) {
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct() {
    this.productService.getProduct(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(resp => this.cartItem = new CartItem(resp));
  }

  addToCart() {
    this.cartService.addToCart(this.cartItem);
  }

  handleQuantityChange(qt: number) {
    if (qt >= 1) {
      this.cartItem.quantity = qt;
    }
  }

  increment(qt: HTMLInputElement) {
    qt.valueAsNumber = qt.valueAsNumber + 1;
    this.cartItem.quantity = qt.valueAsNumber;
  }

  decrement(qt: HTMLInputElement) {
    if (qt.valueAsNumber > 1) {
      qt.valueAsNumber = qt.valueAsNumber - 1;
      this.cartItem.quantity = qt.valueAsNumber;
    }
  }

  handleCheckout() {
    this.route.navigate(['/checkout'], {state: {products: [this.cartItem]}});
  }
}
