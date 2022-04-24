import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Category} from "../models/category";
import {map, retry, timeout} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {PagedResponse} from "../models/pagedResponse";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryUrl = environment.path + 'product-categories';
  private timeOut = 100000;
  private retry = 4;

  constructor(private httpClient: HttpClient) {
  }


  getProductCategories(): Observable<Category[]> {

    return this.httpClient.get<PagedResponse>(this.categoryUrl).pipe(
      timeout(this.timeOut), retry(this.retry), map(response => response._embedded.productCategory)
    );
  }

  saveCategory(productCategory: Category): Observable<Category> {
    return this.httpClient.post<Category>(this.categoryUrl, productCategory);
  }

  updateCategory(productCategory: Category): Observable<Category> {
    return this.httpClient.put<Category>(this.categoryUrl + '/' + productCategory.id, productCategory);
  }

  removeCategory(id: number) {
    return this.httpClient.delete(this.categoryUrl + '/' + id);
  }
}
