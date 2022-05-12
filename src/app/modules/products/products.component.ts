import {Component, OnInit} from '@angular/core';
import {Product} from "../../core/models/product";
import {Option, ProductService} from "../../core/services/product.service";
import {ActivatedRoute} from "@angular/router";
import {DataPage} from "../../core/models/dataPage";
import {CategoryService} from "../../core/services/category.service";
import {Category} from "../../core/models/category";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: Product[] = [];
    selectedCategoryId?:number;

    productPage: DataPage = {pageSize:16,page:1};
    isLoaded = false;

    sortOptions:  Option[]=[];
    categories: Category[]=[];

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
            .getPagedProducts(this.productPage,this.selectedCategoryId)
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
        this.categoryService.getCategories()
            .subscribe(categories => this.categories = categories);
    }

}
