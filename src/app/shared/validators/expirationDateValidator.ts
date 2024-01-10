import {FormControl} from "@angular/forms";

export function ExpirationDateValidator(control: FormControl){
            const monthYear= control.value?.split('/')?.map((val: any)=>Number(val));
            if(!monthYear)
                return null;
            if(!monthYear[1])
                return {'expirationDate': 'Invalid expiration date'};
    const currentDate = new Date();
            const cardDate = new Date(2000+monthYear[1],monthYear[0]-1,currentDate.getDate());
            if(cardDate<=currentDate)
                return {'expirationDate': 'Expiration date must be in the future'};
            return null;
}
