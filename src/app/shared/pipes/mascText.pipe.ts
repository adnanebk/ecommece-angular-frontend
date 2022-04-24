import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'maskText'
})
export class MascTextPipe implements PipeTransform {

  transform(cardNumber: string, visibleDigits: number): string {

    let visibleNumbers = cardNumber.slice(0, visibleDigits);
    let maskedNumbers = cardNumber.slice(visibleDigits);
    return visibleNumbers + maskedNumbers.replace(/./g, '*');
  }

}
