import {Injectable} from '@angular/core';
import {map, retry, timeout} from "rxjs/operators";
import {Product} from "../models/product";
import {HttpClient, HttpParams} from "@angular/common/http";
import {throwError} from "rxjs";
import {environment} from "../../environments/environment.prod";
import {PagedResponse} from "./pagedResponse";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productUrlV2 = environment.path + 'products/v2';
  private productUrl = environment.path + 'products';
  private timeOut = 100000;
  private retry = 4;

  constructor(private httpClient: HttpClient) {
  }


  gePagedProducts(page = 0, pageSize = 20, sort = 'dateCreated', search = '', direction = 'asc', theCategoryId = 0) {
    if (sort === 'dateCreated') {
      direction = 'desc';
    }
    const searchUrl = (theCategoryId > 0 && search === '') ?
      `${this.productUrl}/search/byCategory?id=${theCategoryId}&page=${page}`
      : (search !== '') ?
        `${this.productUrl}/search/byNameOrDescription?name=${search}&description=${search}&page=${page}`
        : this.productUrl + '?page=' + page;
    return this.httpClient.get<PagedResponse>(searchUrl + '&size=' + pageSize + '&sort=' + sort + ',' + direction)
      .pipe(timeout(this.timeOut), retry(this.retry), map((response) => {
          return {data: response._embedded.products, page: response.page};
        })
      );
  }

  getProduct(id: string) {
    return this.httpClient.get<Product>(`${this.productUrl}/${id}`);
  }

  saveProduct(product: Product) {
    return this.httpClient.post<Product>(this.productUrlV2, product);
  }

  updateProduct(product: Product) {
    return this.httpClient.put<Product>(this.productUrlV2, product);
  }

  removeProduct(id: number) {
    return this.httpClient.delete(this.productUrl + "/" + id);
  }

  updateProducts(products: Product[]) {
    return this.httpClient.put<Product[]>(this.productUrlV2 + '/list', products);
  }

  deleteProducts(productsIds: number[]) {
    const params = new HttpParams().set('Ids', productsIds.join(','));
    return this.httpClient.delete(this.productUrlV2, {params});
  }

  saveProductsToExcel(products: Product[]) {
    const params = new HttpParams().set('Ids', products.map(p => p.id).join(','));
    // @ts-ignore
    return this.httpClient.get<any>(this.productUrlV2 + '/excel', {params, responseType: 'blob'});
  }

  saveProductsFromExcel(file: File) {
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      return throwError('File must be Xlsx type');
    }
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<Product[]>(this.productUrlV2 + '/excel', formData);

  }
}

