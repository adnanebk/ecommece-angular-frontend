import {AbstractControl} from "@angular/forms";

export function ValidateCardExpirationDate(control: AbstractControl){
    const monthYear= control.value?.split('/')?.map((val: any)=>Number(val));
    if(monthYear && !monthYear[1]) {
        control.setErrors({'expirationDate': 'Invalid expiration date'});
        return;
    }
    const currentDate = new Date();
    const cardDate = new Date(2000+monthYear[1],monthYear[0]-1,currentDate.getDate());
    if(cardDate<=currentDate)
        control.setErrors({'expirationDate': 'Expiration date must be in the future'});
    else control.setErrors(null);
}
