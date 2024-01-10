import {AbstractControl, ValidatorFn} from "@angular/forms";
import {CreditCard} from "../../core/models/CreditCard";


export const  CardNumberValidator = (cards:CreditCard[]):ValidatorFn => {
return (control: AbstractControl) => {
    const cardNumber = control.value?.replaceAll('-', '');
    if (cardNumber?.length && cardNumber?.length < 16) {
      return   {'cardNumber': 'Invalid card number'};
    }
    const isExist = cards.some(card => card.cardNumber === cardNumber);
    if (isExist && !control.hasError('cardNumber'))
        return  {'cardNumber': 'Card number already used'};
    return null

}
}
