import {Injectable} from '@angular/core';
import {map, retry, timeout} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";
import {throwError} from "rxjs";
import {environment} from "../../../environments/environment.prod";
import {PagedResponse} from "../models/pagedResponse";
import {Product} from "../models/product";
import {ProductPage} from "../models/productPage";

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


  getSortOptions():Option[] {
    return [{value:'name',display:'Name'},{value:'dateCreated',display:'Newest'},{value:'unitPrice',display:'Price'}];
  }

  gePagedProducts(productPage: ProductPage) {
    let searchUrl = this.createUrl(productPage);

    return this.httpClient.get<PagedResponse>(searchUrl)
      .pipe(timeout(this.timeOut), retry(this.retry), map((response) => {
          return {data: response._embedded.products, page: response.page};
        })
      );
  }
 // to do (rename id to categoryId)
  private createUrl(productPage: ProductPage) {
    let {pageNum, pageSize = 20, direction, sort = 'dateCreated', categoryId, searchValue} = productPage;
    if (!direction)
      direction = sort === 'dateCreated' ? 'desc' : 'asc';
    return this.productUrl+( (categoryId && searchValue) ?
        `/search/byNameOrDescriptionAndCategory?name=${searchValue}&description=${searchValue}&id=${categoryId}&page=0`
        : categoryId ?  `/search/byCategory?id=${categoryId}&page=0`
        : searchValue ? `/search/byNameOrDescription?name=${searchValue}&description=${searchValue}&page=0`
        : '?page=' + pageNum)
        + '&size=' + pageSize + '&sort=' + sort + ',' + direction;
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

export interface Option {
  value:any;
  display:string;
}
