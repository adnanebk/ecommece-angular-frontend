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
  productHeaders: string[];
  productFields: any[];
  categoryFields: any[];
  categoryHeaders: any[];
  categoryNames: string[];
  categories: ProductCategory[];
  pageSize = 20;
  size = 20;
  page = 1;
  sort: string;
  search = '';
  direction: string;
  errors: any[];
  filesUploading: boolean[] = [];
  isProductSwitch = true;



  constructor(private httpService: HttpService, private imageService: ImageService) {
    this.productFields =  [...Product.fields];
    this.productHeaders = [...Product.headers];
    this.categoryFields =  [...ProductCategory.fields];
    this.categoryHeaders = [...ProductCategory.headers];
    this.fetchProducts(this.page);
    this.httpService.getProductCategories().subscribe(resp => {
      this.categories = resp;
      this.categoryNames = resp.map(c => c.categoryName);
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
      errors => this.errors = errors
    );
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

  handleDataDeleted($event: Product) {
    this.errors = [];
    this.httpService.removeProduct($event.id).subscribe();
  }

  handleUploadFile($event: { file: File; index: number }) {
    this.filesUploading[$event.index] = true;
    this.errors = [];
    this.imageService.uploadImage($event.file).subscribe(
      (res) => {
        const prod = this.products[$event.index];
        prod.imageUrl = prod.imageUrl.toString();
        this.products = [...this.products, {...prod}];
        this.filesUploading[$event.index] = false;
      },
      (err) => {
        this.errors.push(err);
        this.filesUploading[$event.index] = false;
      });
  }

  getNewProduct() {
  return new Product();
  }
  getNewProductCategory() {
  return new ProductCategory();
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

  handleCategoryAdded() {
    this.errors = [];
    this.httpService.saveCategory(this.categories[0]).subscribe(resp => {
        // this.products[0] = {...resp};
        this.categories = this.categories.map( c => {
          if (c.id === 0)
            return resp;
          return c;
        });
      },
      errors => this.errors = errors
    );
  }
  handleCategoryChanged(index: number) {
    this.errors = [];
    this.httpService.updateCategory(this.categories[index]).subscribe(resp => {
        this.categories = this.categories.map( c => {
          if (c.id === resp.id)
            return resp;
          return c;
        });
      },
      errors => this.errors = errors
    );
  }

  handleCategoryDeleted($event: ProductCategory) {
    this.errors = [];
    this.httpService.removeCategory($event.id).subscribe();
  }

  changeProductswitch(b: boolean) {
    this.errors = [];
    this.isProductSwitch = b;
  }
}
