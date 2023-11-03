import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CartService} from "../../../../core/services/cart.service";
import {Product} from "../../../../core/models/product";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./product.component.scss']
})
export class ProductComponent {

    @Input() product!: Product;

    constructor(private cartService: CartService) {
    }


    addToCart() {
        const quantity = 1;
        this.cartService.addToCart({...this.product, quantity});
    }

}
