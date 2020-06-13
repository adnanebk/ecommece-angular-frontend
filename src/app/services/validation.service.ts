import { Injectable } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  getErrorMessage(input, form: FormGroup, isClientSideEnabled , errors) {
    const fieldName = input.getAttribute('formControlName');
    if (isClientSideEnabled)
    {
      input.classList.add('ng-invalid');
      for (const key of Object.keys(form.controls)) {
        const control = form.get(key).get(fieldName);
        console.log(control);
        if (control &&  (control.dirty) && control.invalid)
        {
          if (control.errors.required)
          {
            return  'this field is required';
          }
          else if (fieldName === 'email' && control.errors.email) {
            return 'email must be a valid email';
          }
        }
      }
    }
    else {
      input.classList.remove('ng-invalid');
    }
    if (errors.length > 0)
    {
      const err =  errors.find(error => error.fieldName === fieldName);
      console.log(err);
      if (err !== undefined)
      {
        input.style.border = '1px solid red';
        input.nextElementSibling?.classList.add( 'err-text');
        return err?.name + ' ' + err?.message;
      }
      else {
        input.style.border = 'none';
        input.nextElementSibling?.classList.remove( 'err-text');
      }
    }
  }
}
