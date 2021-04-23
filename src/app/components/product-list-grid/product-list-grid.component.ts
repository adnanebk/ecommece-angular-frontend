import {Component, OnInit} from '@angular/core';
import {HttpService} from 'src/app/services/http.service';
import {Product} from 'src/app/models/product';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../models/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list-grid.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number;
  searchValue: string;
  page = 1;
  size: number;
  pageSize = 20;
  sort: string;
  isLoaded = false;
   direction='asc';

  constructor(private httpService: HttpService, private route: ActivatedRoute, private cartService: CartService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((paramQ) => {
      this.searchValue = paramQ.search;

    });
    this.route.paramMap.subscribe((param) => {
      this.currentCategoryId = +param.get('id');
      this.getPagedProducts();
    });
  }

  getPagedProducts() {
    this.httpService.gePagedtProducts((this.page - 1), this.pageSize, this.sort, this.searchValue, this.direction, this.currentCategoryId).subscribe(
      resp => {
        this.mapDataFromResponse(resp);
      }
    );
  }


  addToCart(tempProduct: Product) {
    this.cartService.addToCart(new CartItem(tempProduct));
  }

  updatePageSize(value: number) {
    this.pageSize = value;
    this.getPagedProducts();
  }

  updateSort(sort: string) {
    this.sort = sort;
    this.getPagedProducts();
  }

  handleSearch(resp: string) {
    this.searchValue = resp;
    //this.listProducts();
    this.getPagedProducts();
    /*    if(!(this.products.length>0))
         this.size=0;*/
    // this.router.navigate(['/products'], { queryParams: { search: value} });

  }

  private mapDataFromResponse(resp: any) {
    this.isLoaded = true;
    this.products = resp.data;
    this.size = resp.page.totalElements;
    this.pageSize = resp.page.size;
  }

}
