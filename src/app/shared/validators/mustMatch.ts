import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(matchingControlName: string, key: string, message = 'field not match'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent?.controls)
            return null;
        console.log('--', matchingControlName)
        const matchingControl = control.parent.get(matchingControlName) as AbstractControl;
        if (control.errors && !control.errors['mustMatch']) {
            // return if another validator has already found an error on the matchingControl
            return null
        }

        // set error on matchingControl if validation fails
        return control?.value !== matchingControl?.value ? {[key]: message} : null;


    };
}
