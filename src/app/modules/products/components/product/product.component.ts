import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input
} from '@angular/core';
import {CartService} from "../../../../core/services/cart.service";
import {Product} from "../../../../core/models/product";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements AfterContentInit {

    @Input() product!: Product;
    currentImage = '';
    imageInterval: any;


    constructor(private cartService: CartService, private chd: ChangeDetectorRef) {
    }

    ngAfterContentInit(): void {
        this.currentImage = this.product.images[0];
    }

    addToCart() {
        this.cartService.addToCart({...this.product, quantity: 1});
    }

    getNextImage() {
        let index = 1;
        this.imageInterval = setInterval(() => {
            if (index < this.product.images.length) {
                this.currentImage = this.product.images[index++];
                this.chd.markForCheck();
            }
        }, 600);
    }

    backToFirstImage() {
        clearInterval(this.imageInterval);
        this.currentImage = this.product.images[0];
    }

}
