
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {ProductCategory} from '../models/product-category';
import {Order} from '../models/order';
import {MyError} from '../models/my-error';
import {AppUser} from '../models/app-user';
import {environment} from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.path;
 // private baseUrl = 'http://localhost:8080/api/';

  private productUrl = this.baseUrl + 'products';
  private orderUrl = this.baseUrl + 'userOrders';
  private categoryUrl = this.baseUrl + 'product-category';
  constructor(private httpClient: HttpClient) { }

 getProductList(page: number= 0, pageSize: number = 20, sort: string = 'dateCreated', direction: string = 'asc', theCategoryId: number = 0, search: string= ''){
    // need to build URL based on category id
    if ( sort === 'dateCreated' )
    {
      direction = 'desc';
    }
    const searchUrl = (theCategoryId > 0 && search === '') ? `${this.productUrl}/search/byCategory?id=${theCategoryId}&page=${page}`
    : (theCategoryId > 0 && search !== '') ? `${this.productUrl}/search/byCategoryAndName?id=${theCategoryId}&name=${search}&page=${page}`
    : (theCategoryId <= 0 && search !== '') ? `${this.productUrl}/search/byName?name=${search}&page=${page}`
    : this.productUrl + '?page=' + page;
    return this.httpClient.get<GetResponse>(searchUrl + '&size=' + pageSize + '&sort=' + sort + ',' + direction).pipe(
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
    return this.httpClient.post<Order>(this.orderUrl , order).pipe(
      // map(response => response)
    );
  }
  getOrders(userName: string): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.orderUrl + '/byUserName/' + userName , ).pipe(
      map(response => response)
    );
  }

  saveProduct(product: Product): Observable<Product> {
   return this.httpClient.post<Product>(this.baseUrl + 'products/v2', product);
  }
  updateProduct(product: Product): Observable<Product> {
    console.log('update pod', product);
    return this.httpClient.put<Product>(this.baseUrl + 'products/v2' , product);
  }
  removeProduct(id: number) {
    return this.httpClient.delete(this.baseUrl + 'products/' + id);
  }

  saveCategory(productCategory: ProductCategory): Observable<ProductCategory> {
    return this.httpClient.post<ProductCategory>(this.categoryUrl , productCategory);
  }

  updateCategory(productCategory: ProductCategory): Observable<ProductCategory> {
    return this.httpClient.put<ProductCategory>(this.categoryUrl + '/' + productCategory.id , productCategory);
  }

  removeCategory(id: number) {
    return this.httpClient.delete(this.categoryUrl + '/' + id);

  }

  updateProducts(products: Product[]) {
    return this.httpClient.put<Product[]>(this.productUrl + '/v3', products );
  }
  deleteProducts(productsIds: number[]) {
    const params = new HttpParams().set('Ids', productsIds.join(','));
    return this.httpClient.delete(this.productUrl + '/v3' , {params});
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

