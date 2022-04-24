import { Component, OnInit } from '@angular/core';
import {Product} from "../../core/models/product";
import {ProductService, Option} from "../../core/services/product.service";
import {ActivatedRoute} from "@angular/router";
import {ProductPage} from "../../core/models/productPage";
import {CategoryService} from "../../core/services/category.service";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: Product[] = [];

    productPage: ProductPage = {pageSize:16,page:1};
    isLoaded = false;

    sortOptions:  Option[]=[];
    categoryOptions: Option[]=[];

    constructor(private productService: ProductService, private route: ActivatedRoute, private categoryService: CategoryService) {
    }
    ngOnInit() {
        this.getPagedProducts();
        this.getCategories();
        this.sortOptions = this.productService.getSortOptions();
    }




    getPagedProducts(page=1) {
        this.productPage.page=page;
        this.productService
            .gePagedProducts(this.productPage)
            .subscribe(
                resp => {
                    this.mapDataFromResponse(resp);
                }
            );
    }


    private mapDataFromResponse(resp: any) {
        this.isLoaded = true;
        this.products = resp.data;
        this.productPage.totalSize = resp.page.totalElements;
    }


    private getCategories() {
        this.categoryService.getProductCategories()
            .subscribe(categories => this.categoryOptions = categories.map(category =>  ({value:category.id,display:category.name})));
    }

}
