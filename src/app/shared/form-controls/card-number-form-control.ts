import {FormControl} from '@angular/forms';

export class CardNumberFormControl extends FormControl {

  override setValue(value: string, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }) {

      if(!value)
          return;

      super.setValue(CardNumberFormControl.toCardFormat(value));
      return;

  }

    private static toCardFormat(val:string) {
    return val.replace(/[^0-9]/g, "").substring(0, 16).split("").reduce(cardFormat, "");
    function cardFormat(prev: string | number, current: string, i: number) {
        return prev + ((!i || (i % 4)) ? "" : "-") + current;
    }
}

}


