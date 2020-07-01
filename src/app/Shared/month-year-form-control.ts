import {FormControl} from '@angular/forms';
import {isNumeric} from 'rxjs/internal-compatibility';

export class MonthYearFormControl extends FormControl{

  // tslint:disable-next-line:max-line-length
    setValue(value: string, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }) {

       if (value.length > 2 && !value.includes('/') )
       {
         super.setValue(this.value);
         return ;
       }
       if ( value.length === 2 && isNumeric(value) && this.value.length <= value.length && +value >= 1 && +value <= 12  )
    {
      super.setValue(value + '/' , {...options, emitModelToViewChange: true});
    }
    else if ( value.length <= 5 && value.length !== 2 && isNumeric(value.replace('/', '')))
    {
      if (value.length === 5)
      {
        const  currentDate = new Date();
        const month = +value.split('/')[0];
        const year = 2000 + Number(value.split('/')[1]);
        if ( year < currentDate.getFullYear() || ( new Date(year, month) < currentDate ) )
        {
          super.setValue(this.value);
          return ;
        }
      }
      super.setValue(value , {...options, emitModelToViewChange: true});
    }
    else if ( value.length <= this.value.length )
    {
      super.setValue(value , {...options, emitModelToViewChange: true});
    }
    else
    {
      console.log('this');
      super.setValue(this.value);
    }
}



}

