import { ValidatorFn} from "@angular/forms";
import {CreditCard} from "../../core/models/CreditCard";
import {LoggerModule} from "ngx-logger";


export function uniqueCardNumberValidatorAsync(cards:CreditCard[],initialCardNumber:string | undefined):ValidatorFn {
    return control => {
        const controlValue = control.value?.replaceAll('-', '');
        if(initialCardNumber==controlValue)
            return null;
        if (cards.some(card => card.cardNumber == controlValue)) {
            return {uniqueCardNumber: 'Card number already used'};
        }
        return null;

    }
}