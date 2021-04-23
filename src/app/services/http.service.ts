import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Product} from '../models/product';
import {Observable, throwError} from 'rxjs';
import {map, retry, timeout} from 'rxjs/operators';
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
  private productUrl = this.baseUrl + 'products';
  private orderUrl = this.baseUrl + 'userOrders';
  private categoryUrl = this.baseUrl + 'product-category';
  private  timeOut=100000;
  private  retry=4;
  constructor(private httpClient: HttpClient) {
  }


  gePagedtProducts(page = 0, pageSize = 20, sort = 'dateCreated', search = '', direction = 'asc', theCategoryId = 0) {
    if (sort === 'dateCreated') {
      direction = 'desc';
    }
    const searchUrl = (theCategoryId > 0 && search === '') ?
      `${this.productUrl}/search/byCategory?id=${theCategoryId}&page=${page}`
      : (search !== '') ?
        `${this.productUrl}/search/ByNameOrDescription?name=${search}&description=${search}&page=${page}`
        : this.productUrl + '?page=' + page;
    return this.httpClient.get<PagedResponse>(searchUrl + '&size=' + pageSize + '&sort=' + sort + ',' + direction)
       .pipe(timeout(this.timeOut),retry(this.retry),map(response => {
        return {data: response._embedded.products, page: response.page};
      })
    );
  }

  getProduct(id: string) {
    return this.httpClient.get<Product>(`${this.productUrl}/${id}`);
  }

  saveProduct(product: Product) {
    return this.httpClient.post<Product>(this.baseUrl + 'products/v2', product);
  }

  updateProduct(product: Product) {
    return this.httpClient.put<Product>(this.baseUrl + 'products/v2', product);
  }

  removeProduct(id: number) {
    return this.httpClient.delete(this.baseUrl + 'products/' + id);
  }

  updateProducts(products: Product[]) {
    return this.httpClient.put<Product[]>(this.productUrl + '/v3', products);
  }

  deleteProducts(productsIds: number[]) {
    const params = new HttpParams().set('Ids', productsIds.join(','));
    return this.httpClient.delete(this.productUrl + '/v3', {params});
  }

  saveProductsToExcel(products: Product[]) {
    const params = new HttpParams().set('Ids', products.map(p => p.id).join(','));
    // @ts-ignore
    return this.httpClient.get<any>(this.productUrl + '/excel', {params, responseType: 'blob'});
  }

  saveProductsFromExcel(file: File) {
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      return throwError('File must be Xlsx type');
    }
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<Product[]>(this.productUrl + '/excel', formData);

  }


  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<PagedResponse>(this.categoryUrl).pipe(
      timeout(this.timeOut),retry(this.retry),map(response => response._embedded.productCategory)
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


  getOrders(userName: string): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.orderUrl + '/byUserName/' + userName,).pipe(
      map(response => response)
    );
  }

  saveOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.orderUrl, order);
  }


  register(user: any) {
    return this.httpClient.post<{ token: string, appUser: AppUser }>(this.baseUrl + 'register', user);
  }

  login(user: any) {
    return this.httpClient.post<{ token: string, appUser: AppUser }>(this.baseUrl + 'login', user);
  }

}

interface PagedResponse {
  _embedded: any;
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

