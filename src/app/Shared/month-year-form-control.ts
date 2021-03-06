import {FormControl} from '@angular/forms';
import {isNumeric} from 'rxjs/internal-compatibility';

export class MonthYearFormControl extends FormControl {

  // tslint:disable-next-line:max-line-length
  setValue(value: string, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }) {
    if (this.value == null) {
      super.setValue('');
      return;
    }
    const numValue = value.replace(new RegExp('/', 'g'), '0');
    if (value.length > 0 && !isNumeric(numValue)) {
      super.setValue(this.value);
      return;
    }

    if (value.length === 2 && (Number(value) > 12 || Number(value) <= 0)) {
      super.setValue(this.value);
      return;
    }
    /*    if (value.length > 2 && !value.includes('/') )
         {
           super.setValue(this.value);
           return ;
         }*/
    if (value.length === 2 && this.value?.length <= value.length) {

      super.setValue(value + '/', {...options, emitModelToViewChange: true});
    } else if (value.length >= 5 && value.length !== 2) {
      const values = value.split('/');
      const currentDate = new Date();
      const month = +values[0];
      const year = 2000 + Number(values[1]);

      if (month <= 0 || month > 31 || values[1].length > 2) {
        super.setValue(this.value);
        return;
      }
      if (year < currentDate.getFullYear() || (new Date(year, month) < currentDate)) {
        super.setValue(this.value);
        return;
      }
      super.setValue(value, {...options, emitModelToViewChange: true});
    } else if (value.length <= this.value?.length) {
      super.setValue(value, {...options, emitModelToViewChange: true});
    }
  }


}

