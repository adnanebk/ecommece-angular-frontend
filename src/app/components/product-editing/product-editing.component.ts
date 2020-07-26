import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Product} from '../../models/product';
import {ProductCategory} from '../../models/product-category';

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
  size: number;
  isLoaded: boolean;
  errors = [];

  constructor(private httpService: HttpService) {
    this.fields = [...Product.fields];
    this.headers = [...Product.headers];
    this.httpService.getProductList
    (0, this.size).subscribe(resp => {
      this.products = [...resp.data];
      this.size = resp.page.totalElements;
    });
    this.httpService.getProductCategories().subscribe(resp => {
      this.categories = resp.map(c => c.categoryName);
    });
  }

  ngOnInit(): void {

  }
  handleDataChanged($event: any) {
    this.httpService.saveProduct($event).subscribe(resp => {
this.products = this.products.map( p => {
        if (p.id === $event.id)
        {
          return resp;
        }
        return p;
      });
    });
  }

  handleUploadFile($event: any) {

  }

  getNewProduct() {

  }

  handleDataPaged($event: any) {

  }

  handleDataAdded($event: any) {

  }

  handleDataDeleted($event: any) {

  }
}
