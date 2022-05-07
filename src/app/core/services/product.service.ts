import {Injectable} from '@angular/core';
import {map, retry, timeout} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";
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

  private createUrl(productPage: ProductPage) {
    let {page, pageSize, direction, sort = 'dateCreated', categoryId, searchValue} = productPage;
    if (!direction)
      direction = sort === 'dateCreated' ? 'desc' : 'asc';
    if (categoryId && searchValue) {
      return this.productUrl + `/search/categoryAndNameOrDescription?name=${searchValue}&description=${searchValue}&categoryId=${categoryId}`
          + `&page=${page - 1}&size=${pageSize}&sort=${sort},${direction}`;
    }
    return this.productUrl + categoryId ? `/search/category?categoryId=${categoryId}`
        : searchValue ? `/search/nameOrDescription?name=${searchValue}&description=${searchValue}` : '?'
            + `&page=${page - 1}&size=${pageSize}&sort=${sort},${direction}`;
  }

  getProduct(sku: string) {
    return this.httpClient.get<Product>(`${this.productUrl}/search/sku/?sku=${sku}`);
  }


  saveProduct(product: Product) {
      return this.httpClient.post<Product>(this.productUrlV2, this.getFormData(product));
  }

   updateProduct(product: Product) {
     return this.httpClient.put<Product>(this.productUrlV2,this.getFormData(product));

  }
  private  getFormData(product:Product) {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(product)], { type: "application/json"})
    product.file && formData.append('file', product.file);
    formData.append('product', blob);
    return  formData;
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

  downloadProductsAsExcel(products: Product[]) {
    const httpOptions = {
      responseType: 'blob' as 'json'
  };
    return this.httpClient.get<any>(this.productUrlV2 + '/excel/download/'+products.map(product=>product.id).join(','),httpOptions);
  }

  saveProductsFromExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<Product[]>(this.productUrlV2 + '/excel', formData);

  }


}

export interface Option {
  value:any;
  display:string;
}
