import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Product} from '../../models/product';
import {ProductCategory} from '../../models/product-category';
import {ImageService} from '../../services/image.service';

@Component({
  selector: 'app-product-editing',
  templateUrl: './product-editing.component.html',
  styleUrls: ['./product-editing.component.css']
})
export class ProductEditingComponent implements OnInit {
  products: Product[];
  headers: string[];
  fields: any[];
  categories: string[];
  pageSize = 20;
  size = 20;
  page = 1;
  sort: string;
  search = '';
  direction: string;
  errors: any[];



  constructor(private httpService: HttpService, private imageService: ImageService) {
    this.fields =  [...Product.fields];
    this.headers = [...Product.headers];
    this.fetchProducts(this.page);
    this.httpService.getProductCategories().subscribe(resp => {
      this.categories = resp.map(c => c.categoryName);
    });
  }

  ngOnInit(): void {

  }
  handleDataChanged(index: number) {
    this.errors = [];
    this.httpService.updateProduct(this.products[index]).subscribe(resp => {
    this.products = this.products.map( p => {
        if (p.id === resp.id)
        {
          return resp;
        }
        return p;
      });
    },
      errors => this.errors = errors);
  }
  handleDataAdded() {
    this.errors = [];
    this.httpService.saveProduct(this.products[0]).subscribe(resp => {
     // this.products[0] = {...resp};
        this.products = this.products.map( p => {
          if (p.id === 0)
          {
            return resp;
          }
          return p;
        });
    },
        errors => this.errors = errors
    );
  }

  handleDataDeleted($event: any) {
    this.errors = [];
    this.httpService.removeProduct($event).subscribe();
  }

  handleUploadFile($event: { file: File; index: number }) {
    this.errors = [];
    this.imageService.uploadImage($event.file).subscribe(
      (res) => {
        this.products = [...this.products];
      },
      (err) => {
        this.errors.push(err);
      });
  }

  getNewProduct() {
  return new Product();
  }

  fetchProducts(page?: number) {
    this.errors = [];
    this.httpService.getProductList
    (page - 1, this.pageSize, this.sort, this.direction , 0, this.search).subscribe(resp => {
      this.products = [...resp.data];
      this.size = resp.page.totalElements;
    });
  }


  handleDataSorted($event: { sort: string; direction: string }) {
    this.sort = $event.sort;
    this.direction = $event.direction;
    this.fetchProducts();
  }

  handleDataSearched($event: string) {
      this.search = $event;
      this.fetchProducts();
  }
}
