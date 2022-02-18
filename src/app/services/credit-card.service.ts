import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {Observable} from "rxjs";
import {CreditCard} from "../models/CreditCard";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  private creditCardUrl =  environment.path  + 'creditCards';

  constructor(private httpClient: HttpClient) {

  }


  getCreditCardInfo(userName: string): Observable<CreditCard[]> {
    return this.httpClient.get<PagedResponse>(this.creditCardUrl + '/search/byUserName?userName=' + userName,).pipe(
      map(response => response._embedded.creditCards)
    );
  }

  saveCreditCard(creditCard: CreditCard) {
    return this.httpClient.post<CreditCard>(this.creditCardUrl, creditCard);
  }
  updateCreditCard(creditCard: CreditCard) {
    return this.httpClient.patch<CreditCard>(this.creditCardUrl+'/'+creditCard.id, creditCard);
  }
  removeCreditCard(id: number) {
    return this.httpClient.delete<void>(this.creditCardUrl+'/'+id);
  }

  activeCard(card: CreditCard) {
    return this.httpClient.patch<CreditCard[]>(this.creditCardUrl+'/active',{id:card.id,active:card.active});
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
