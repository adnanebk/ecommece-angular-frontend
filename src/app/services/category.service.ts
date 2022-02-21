import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ProductCategory} from "../models/product-category";
import {map, retry, timeout} from "rxjs/operators";
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {PagedResponse} from "./pagedResponse";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryUrl = environment.path + 'product-categories';
  private timeOut = 100000;
  private retry = 4;

  constructor(private httpClient: HttpClient) {
  }


  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<PagedResponse>(this.categoryUrl).pipe(
      timeout(this.timeOut), retry(this.retry), map(response => response._embedded.productCategory)
    );
  }

  saveCategory(productCategory: ProductCategory): Observable<ProductCategory> {
    return this.httpClient.post<ProductCategory>(this.categoryUrl, productCategory);
  }

  updateCategory(productCategory: ProductCategory): Observable<ProductCategory> {
    return this.httpClient.put<ProductCategory>(this.categoryUrl + '/' + productCategory.id, productCategory);
  }

  removeCategory(id: number) {
    return this.httpClient.delete(this.categoryUrl + '/' + id);
  }
}
