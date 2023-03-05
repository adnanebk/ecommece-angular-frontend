import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../../../../core/services/cart.service";
import {Product} from "../../../../core/models/product";
import {ProductService} from "../../../../core/services/product.service";
import {CartItem} from "../../../../core/models/cart-item";

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
        const sku = this.activatedRoute.snapshot.paramMap.get('sku');
        if (sku) {
            this.productService.getProduct(sku)
                .subscribe(product => this.product = product);
        }
    }

    addToCart() {
        const quantity = this.quantity;
        this.cartService.addToCart({...this.product, quantity});
    }


    increment() {
        this.quantity < this.product.unitsInStock && this.quantity++;
    }

    decrement() {
        this.quantity > 1 && this.quantity--;
    }

    checkout() {
        const cartItem: CartItem = {...this.product, quantity: this.quantity}
        this.route.navigate(['/checkout'], {state: {cartItems: [cartItem]}});
    }

}
