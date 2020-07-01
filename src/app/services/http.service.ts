
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {ProductCategory} from '../models/product-category';
import {Order} from '../models/order';
import {MyError} from '../models/my-error';
import {AppUser} from '../models/app-user';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
 // private baseUrl = 'https://adnanbk-shopp.herokuapp.com/api/';
  private baseUrl = 'http://localhost:8080/api/';

  private productUrl = this.baseUrl + 'products';
  private orderUrl = this.baseUrl + 'userOrders';
  private categoryUrl = this.baseUrl + 'product-category';
  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number = 0, search: string= '', page: number= 0, pageSize: number = 20, sort: string = 'dateCreated'){
    // need to build URL based on category id

    const searchUrl = (theCategoryId > 0 && search === '') ? `${this.productUrl}/search/byCategory?id=${theCategoryId}&page=${page}`
    : (theCategoryId > 0 && search !== '') ? `${this.productUrl}/search/byCategoryAndName?id=${theCategoryId}&name=${search}&page=${page}`
    : (theCategoryId <= 0 && search !== '') ? `${this.productUrl}/search/byName?name=${search}&page=${page}`
    : this.productUrl + '?page=' + page;
    return this.httpClient.get<GetResponse>(searchUrl + '&size=' + pageSize + '&sort=' + sort + ',asc').pipe(
      map(response =>  {
        return { data: response._embedded.products, page: response.page};
      })
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProduct(id: string): Observable<Product> {

    return this.httpClient.get<Product>(`${this.productUrl}/${id}`).pipe(
      map(response => response)
    );
  }

  saveOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.orderUrl, order).pipe(
      // map(response => response)
    );
  }
  getErrorMessage(input: HTMLInputElement, errors: MyError[]) {
    if (errors.length > 0)
    {
      const err =  errors.find(error => error.fieldName === input.getAttribute('formControlName'));
      input.style.border = '1px solid red';
      input.nextElementSibling?.classList.add( 'err-text');
      return err.name + ' ' + err.message;
    }
  }

  getOrders(userName: string): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.orderUrl + '/byUserName/' + userName , ).pipe(
      map(response => response)
    );
  }

  saveUser(user: any) {
    return this.httpClient.post<{ token: string, appUser: AppUser }>(this.baseUrl + 'register', user ).pipe(
      map(response => {
        localStorage.setItem('appUser', JSON.stringify(response.appUser));
        localStorage.setItem('token', response.token);
        return response.appUser;
      })
    );
  }


}

interface GetResponse {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}

