import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(matchingControlName: string,message = 'field not match',key:string):ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
    if(!control.parent?.controls)
      return null;
    console.log('--',matchingControlName)
    const matchingControl = (control.parent?.controls as any)[matchingControlName] as AbstractControl;
    if (control.errors && !control.errors['mustMatch']) {
      // return if another validator has already found an error on the matchingControl
      return null
    }

    /*    if (matchingControl) {
          matchingControl.updateValueAndValidity();
        }*/
    // set error on matchingControl if validation fails
    return control?.value !== matchingControl?.value ? {[key]: message} : null;


  };
}
