import {Injectable} from '@angular/core';
import {retry, timeout} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {PagedResponse} from "../models/pagedResponse";
import {Product} from "../models/product";
import {DataPage} from "../models/dataPage";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private productUrl = environment.api_url + 'products';
    private timeOut = 100000;
    private retry = 4;

    constructor(private httpClient: HttpClient) {
    }


    getProductsInPage(productPage: DataPage, categoryName?: string) {
        let params = new HttpParams()
            .append('number', productPage.number - 1)
            .append('size', productPage.size)
            .append('sortProperty', productPage.sortProperty ?? 'lastUpdated')
            .append('sortDirection', productPage.sortDirection ?? 'DESC')
        if (productPage.search)
            params = params.set('search', productPage.search);
        if (categoryName)
            params = params.append('category', categoryName);
        return this.httpClient.get<PagedResponse<Product[]>>(this.productUrl, {params})
            .pipe(timeout(this.timeOut), retry(this.retry));
    }

    getProduct(sku: string) {
        return this.httpClient.get<Product>(`${this.productUrl}/sku/${sku}`);
    }


    saveProduct(product: Product) {
        return this.httpClient.post<Product>(this.productUrl, this.getFormData(product));
    }

    updateProduct(product: Product) {
        return this.httpClient.put<Product>(this.productUrl + '/' + product.id, this.getFormData(product));

    }

    private getFormData(product: Product) {
        const formData = new FormData();
        const blob = new Blob([JSON.stringify(product)], {type: "application/json"})
        if (product.imageFile?.length)
            product.imageFile?.forEach(file=>formData.append('files', file));
        formData.append('product', blob);
        return formData;
    }

    removeProduct(id: number) {
        return this.httpClient.delete(this.productUrl + "/" + id);
    }

    updateProducts(products: Product[]) {
        return this.httpClient.put<Product[]>(this.productUrl, products);
    }

    deleteProducts(productsIds: number[]) {
        const params = new HttpParams().set('Ids', productsIds.join(','));
        return this.httpClient.delete(this.productUrl, {params});
    }

    downloadProductsAsExcel(products: Product[]) {
        const httpOptions = {
            responseType: 'blob' as 'json'
        };
        return this.httpClient.get<any>(`${this.productUrl}/${products.map(product => product.id).join(',')}/excel`, httpOptions);
    }

    addOrUpdateProductsFromExcel(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.httpClient.post<{ ADDED: Product[], UPDATED: Product[] }>(this.productUrl + '/excel', formData);

    }


    addImage(imageFile: File, productId: number) {
        const formData = new FormData();
        formData.append('imageFile', imageFile);
        return this.httpClient.post<{url:string}>(this.productUrl + '/'+productId+'/images',formData);
    }

    updateImages(imageUrls: string[], productId: number) {
        return this.httpClient.put<void>(this.productUrl + '/'+productId+'/images',imageUrls);
    }
}

