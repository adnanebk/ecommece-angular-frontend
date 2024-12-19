import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Product} from "../../../core/models/product";
import {ProductService} from "../../../core/services/product.service";
import {ActivatedRoute} from "@angular/router";
import {DataPage} from "../../../core/models/dataPage";
import {CategoryService} from "../../../core/services/category.service";
import {Category} from "../../../core/models/category";
import {Filter} from "../../../core/models/filter";
import {Observable, tap} from "rxjs";
import {PagedResponse} from "../../../core/models/pagedResponse";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
    filters: Filter[] = [{property: 'name',direction: 'ASC', display: 'Name'}, {property: 'dateCreated', display: 'Newest'},
        {property: 'unitPrice',direction: 'ASC', display: 'Price: Low to high'},
        {property: 'unitPrice', direction: 'DESC', display: 'Price: High to low'}];
    pagedProducts$!: Observable<PagedResponse<Product[]>>;
    categories$!: Observable<Category[]>;
    selectedCategoryName?: string;
    productPage: DataPage = {size: 10, number: 1};
    selectedFilter?: Filter;
    isLoading= false;

    constructor(private productService: ProductService, private categoryService: CategoryService) {
    }

    ngOnInit() {
        this.getProductsInPage();
        this.getCategories();
    }

    getProductsInPage(fromFirst: boolean = false) {
        if(fromFirst)
           this.productPage.number=1;
        this.isLoading = true;
        this.pagedProducts$ = this.productService.getProductsInPage(this.productPage, this.selectedCategoryName)
            .pipe(tap(()=>this.isLoading=false));
    }

    private getCategories() {
        this.categories$ = this.categoryService.getCategories();
    }


    getProductsByFilter() {
        if (this.selectedFilter) {
            this.productPage.sortProperty = this.selectedFilter.property;
            this.productPage.sortDirection = this.selectedFilter.direction;
            this.getProductsInPage(true);
        }
    }
    
}
