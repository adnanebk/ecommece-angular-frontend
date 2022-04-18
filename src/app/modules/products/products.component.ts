import { Component, OnInit } from '@angular/core';
import {Product} from "../../core/models/product";
import {ProductService, Option} from "../../core/services/product.service";
import {ActivatedRoute} from "@angular/router";
import {ProductPage} from "../../core/models/productPage";
import {CategoryService} from "../../core/services/category.service";
import {Category} from "../../core/models/category";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: Product[] = [];

    productPage: ProductPage = {};
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




    getPagedProducts() {
        this.productService
            .gePagedProducts(this.productPage)
            .subscribe(
                resp => {
                    this.mapDataFromResponse(resp);
                }
            );
    }



    pageChanged(pageNum: number) {
        this.productPage.pageNum=pageNum;
        this.getPagedProducts();

    }

    private mapDataFromResponse(resp: any) {
        this.isLoaded = true;
        this.products = resp.data;
        this.productPage.totalSize = resp.page.totalElements;
        this.productPage.pageSize = resp.page.size;
    }


    private getCategories() {
        this.categoryService.getProductCategories()
            .subscribe(categories => this.categoryOptions = categories.map(category =>  ({value:category.id,display:category.name})));
    }
}
