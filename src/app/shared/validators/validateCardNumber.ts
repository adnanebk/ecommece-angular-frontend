import {AbstractControl} from "@angular/forms";
import {CreditCard} from "../../core/models/CreditCard";


export const  ValidateCardNumber = (control: AbstractControl, cards:CreditCard[])=> {
    const cardNumber = control.value?.replaceAll('-', '');
    if (cardNumber?.length && cardNumber?.length < 16) {
         control.setErrors({'cardNumber': 'Invalid card number'});
         return;
    }
    const isExist = cards.some(card => card.cardNumber === cardNumber && card.id!==control.parent?.get('id')?.value);
    if (isExist)
        control.setErrors({'cardNumber': 'Card number already used'});
    else control.setErrors(null);

}
