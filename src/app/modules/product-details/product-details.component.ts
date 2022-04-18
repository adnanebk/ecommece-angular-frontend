import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../../core/services/cart.service";
import {Product} from "../../core/models/product";
import {ProductService} from "../../core/services/product.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
 quantity = 1;
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private cartService: CartService, private route: Router) {
  }

  ngOnInit(): void {
    this.loadProduct();
  }

   loadProduct() {
     const id = this.activatedRoute.snapshot.paramMap.get('id');
     if(id) {
       this.productService.getProduct(id)
           .subscribe(product => this.product = product);
     }
  }

    addToCart() {
    const {name,image,unitPrice,id} = this.product;
    const quantity = this.quantity;
    this.cartService.addToCart({id,name,unitPrice,image,quantity});
  }



  increment() {
      this.quantity<this.product.unitsInStock && this.quantity++;
  }

  decrement() {
      this.quantity>1 && this.quantity --;
    }

  checkout() {
    this.route.navigate(['/checkout'], {state: {products: [this.product]}});
  }

}
