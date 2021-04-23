import {FormControl} from '@angular/forms';
import {isNumeric} from 'rxjs/internal-compatibility';

export class CardNumberFormControl extends FormControl {

  // tslint:disable-next-line:max-line-length
  setValue(value: string, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }) {
    const numValue = value.replace(/-/g, '0');
    const vLength = value?.length;
    const isTrue = vLength === 4 || vLength === 9 || vLength === 14;
    if (vLength > 19 || (vLength > 0 && vLength <= 19 && !isNumeric(numValue))) {
      super.setValue(this.value);
      return;
    } else if (vLength === 0) {
      super.setValue('');
    }

    if (isTrue && vLength >= this.value.length) {
      super.setValue(value + '-', {...options, emitModelToViewChange: true});
      return;
    }

  }


}

