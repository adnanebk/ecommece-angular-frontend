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
  page = 0;
  errors = [];


  constructor(private httpService: HttpService, private imageService: ImageService) {
    this.fields =  [...Product.fields];
    this.headers = [...Product.headers];
    this.fetchProducts();
    this.httpService.getProductCategories().subscribe(resp => {
      this.categories = resp.map(c => c.categoryName);
    });
  }

  ngOnInit(): void {

  }
  handleDataChanged($event: any) {
    this.httpService.updateProduct($event).subscribe(resp => {
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
  handleDataAdded($event: any) {
    this.errors = [];
    this.httpService.saveProduct($event).subscribe(resp => {
     // this.products[0] = {...resp};
        this.products = this.products.map( p => {
          if (this.products.indexOf(p) === 0)
          {
            return resp;
          }
          return p;
        });
        console.log('product saved', this.products);
    },
        errors => this.errors = errors
    );
  }

  handleDataDeleted($event: any) {
    this.errors = [];
    this.httpService.removeProduct($event);
  }
  handleUploadFile(file: File) {
    this.errors = [];
    this.imageService.uploadImage(file).subscribe(
      (res) => {
      },
      (err) => {

      });
  }

  getNewProduct() {
  return new Product();
  }

  fetchProducts() {
    this.httpService.getProductList
    (this.page, this.pageSize).subscribe(resp => {
      this.products = [...resp.data];
      this.size = resp.page.totalElements;
    });
  }


}
