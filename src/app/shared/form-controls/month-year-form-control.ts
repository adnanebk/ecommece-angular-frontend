import {FormControl} from '@angular/forms';

export class MonthYearFormControl extends FormControl {


    override setValue(value: string, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }) {
        if (!value)
            return;
        let prevValue = value.substring(0, value.length - 1);

        let regexPattern = /^-?[0-9]+$/;

        let lastCharacter = value.charAt(value.length - 1);

        if (!regexPattern.test(lastCharacter) || value.length > 5) {
            super.setValue(prevValue);
            return;
        }

        if (value.length == 2) {
            const month = Number(value.split('/')[0]);
            if (month <= 0 || month > 12) {
                super.setValue(prevValue);
                return;
            }
            if (value.length > this.value.length)
                super.setValue(value + '/', {...options, emitModelToViewChange: true});
        } else if (value.length === 3)
            super.setValue(prevValue + '/' + lastCharacter, {...options, emitModelToViewChange: true});


        else
            super.setValue(value);

    }
}
