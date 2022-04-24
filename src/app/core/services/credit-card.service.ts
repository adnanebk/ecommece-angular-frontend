import {Injectable} from '@angular/core';
import {CreditCard} from "../models/CreditCard";
import {map, timeout} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {PagedResponse} from "../models/pagedResponse";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  private creditCardUrl = environment.path + 'creditCards';

  constructor(private httpClient: HttpClient) {

  }


  getCreditCards(email: string):Observable<CreditCard[]> {
    return this.httpClient.get<PagedResponse>(this.creditCardUrl + '/search/email?email=' + email)
        .pipe(map((response) =>response._embedded.creditCards));
  }

  saveCreditCard(creditCard: CreditCard) {
    creditCard.cardNumber = creditCard.cardNumber?.replace(/-/g,'');
    return this.httpClient.post<CreditCard>(this.creditCardUrl, creditCard);
  }

  updateCreditCard(creditCard: CreditCard) {
    creditCard.cardNumber = creditCard.cardNumber?.replace(/-/g,'');
    return this.httpClient.patch<CreditCard>(this.creditCardUrl + '/' + creditCard.id, creditCard);
  }

  removeCreditCard(id: number) {
    return this.httpClient.delete<void>(this.creditCardUrl + '/' + id);
  }

  activeCard(id:number) {
    return this.httpClient.patch<void>(this.creditCardUrl + '/active/'+id,null);
  }

  getCardNames(){
    return [{cardType: 'VISA', name: 'Visa'}, {cardType: 'MASTERCARD', name: 'Master Card'}];
  }
}

