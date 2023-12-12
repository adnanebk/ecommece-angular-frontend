import {Injectable} from '@angular/core';
import {CreditCard} from "../models/CreditCard";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {BehaviorSubject, map, of, switchMap} from "rxjs";
import {tap} from "rxjs/operators";

export interface CardOption {
    cardType: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class CreditCardService {

    private creditCardUrl = environment.api_url + 'creditCards';
    private $cardsSubject = new BehaviorSubject<CreditCard[]>([]);

    constructor(private httpClient: HttpClient) {

    }


    getCreditCards(){
       return this.httpClient.get<CreditCard[]>(this.creditCardUrl)
           .pipe(switchMap((cards)=> {
               this.$cardsSubject.next(cards);
               return this.$cardsSubject;
           }));
    }

    saveCreditCard(creditCard: CreditCard) {
        creditCard.cardNumber = creditCard.cardNumber?.replace(/-/g, '');
        return this.httpClient.post<CreditCard>(this.creditCardUrl, creditCard)
              .pipe(tap(card=>this.$cardsSubject.next([...this.$cardsSubject.value,card])));
    }

    updateCreditCard(creditCard: CreditCard) {
        creditCard.cardNumber = creditCard.cardNumber?.replace(/-/g, '');
        return this.httpClient.put<void>(this.creditCardUrl + '/' + creditCard.id, creditCard)
            .pipe(tap(()=>{
                this.$cardsSubject.next(this.$cardsSubject.value.map(card=>card.id===creditCard.id
                    ?{...creditCard,active:card.active}:card));
            }));

    }

    removeCreditCard(card: CreditCard) {
        return this.httpClient.delete<void>(this.creditCardUrl + '/' + card.id)
            .pipe(switchMap(() => {
                let newCards = this.$cardsSubject.value.filter(c => c.id !== card.id) || [];
                if (card.active && newCards.length) {
                    return this.activeCard(newCards[0].id)
                        .pipe(map(() => {
                            newCards[0].active = true;
                            return newCards;
                        }));

                }
                return of(newCards)
            }),tap(cards=>this.$cardsSubject.next(cards)));
    }

    activeCard(id: number) {
        return this.httpClient.patch<void>(this.creditCardUrl + '/active/' + id, null)
            .pipe(tap(()=>{
                this.$cardsSubject.next(this.$cardsSubject.value.map(card=>{
                    card.active = card.id===id;
                    return card;
                }));
            }));
    }

    getCardNames():CardOption[] {
        return [{cardType: 'VISA', name: 'Visa'}, {cardType: 'MASTERCARD', name: 'Master Card'}];
    }
    
}

