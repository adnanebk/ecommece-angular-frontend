import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Product } from 'src/app/models/product';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../models/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list-grid.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  searchValue: string;
  page: number;
  size: number;
  pageSize = 20;
  sort: string;
  isLoaded = false;
  constructor(private httpService: HttpService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit() {
    this.route.queryParams.subscribe( (paramQ) => {
      this.searchValue = paramQ.search;
      if (!this.route.snapshot.paramMap.has('id')) {
        this.listProducts();
      }
    } );
    this.route.paramMap.subscribe((param) => {
      this.currentCategoryId = +param.get('id');
      this.listProducts();
    });
  }

  listProducts() {
    // this.currentCategoryId = this.route.snapshot.paramMap.has('id') && +this.route.snapshot.paramMap.get('id');
this.httpService.getProductList((this.page - 1), this.pageSize, this.sort, 'asc', this.currentCategoryId, this.searchValue).subscribe(
      data => {
        this.isLoaded = true;
        this.products = data.data;
        this.page = data.page.number + 1;
        this.size = data.page.totalElements;
        this.pageSize = data.page.size;
      }
    );
  }

  addToCart(tempProduct: Product) {
  this.cartService.addToCart(new CartItem(tempProduct));
  }

  updatePageSize(value: number) {
    this.pageSize = value;
    this.listProducts();
  }

  updateSort(sort: string) {
    this.sort = sort;
    this.listProducts();
  }
}
