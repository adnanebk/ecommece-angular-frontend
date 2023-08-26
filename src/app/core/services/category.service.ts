import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Category} from "../models/category";
import {retry, timeout} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private categoryUrl = environment.api_url + 'categories';
    private timeOut = 100000;
    private retry = 4;

    constructor(private httpClient: HttpClient) {
    }


    getCategories(): Observable<Category[]> {

        return this.httpClient.get<Category[]>(this.categoryUrl).pipe(
            timeout(this.timeOut), retry(this.retry));
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
