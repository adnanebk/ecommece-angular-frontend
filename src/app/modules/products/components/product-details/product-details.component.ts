import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../../../../core/services/cart.service";
import {Product} from "../../../../core/models/product";
import {ProductService} from "../../../../core/services/product.service";
import {CartItem} from "../../../../core/models/cart-item";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
    product$!: Observable<Product>;
    quantity = 1;
    currentImage = ''

    constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private cartService: CartService, private route: Router) {
    }

    ngOnInit(): void {
        this.loadProduct();
    }

    loadProduct() {
        const sku = this.activatedRoute.snapshot.paramMap.get('sku');
        if (sku) {
            this.product$ = this.productService.getProduct(sku)
                .pipe(tap(product => this.currentImage = product.images[0]))
        }
    }

    addToCart(product: Product) {
        const quantity = this.quantity;
        this.cartService.addToCart({...product, quantity});
    }


    increment(product: Product) {
        this.quantity < product.unitsInStock && this.quantity++;
    }

    decrement() {
        this.quantity > 1 && this.quantity--;
    }

    checkout(product: Product) {
        const cartItem: CartItem = {...product, quantity: this.quantity}
        this.route.navigate(['/checkout'], {state: {cartItems: [cartItem]}});
    }

    getNextImage(product: Product) {
        const index = product.images.indexOf(this.currentImage);
        if (index + 1 < product.images.length)
            this.currentImage = product.images[index + 1];
    }

    getPrevImage(product: Product) {
        const index = product.images.indexOf(this.currentImage);
        if (index > 0)
            this.currentImage = product.images[index - 1];
    }
}
