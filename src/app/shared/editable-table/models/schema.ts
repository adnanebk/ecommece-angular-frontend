import { AbstractControl } from "@angular/forms";
import {InputType} from "../editable-table.component";

export interface Schema {
    name: string;
    formControl: AbstractControl;
    display: string;
    type: InputType;
    readOnly?: boolean;
    selectOptions?: { displayField: string, valueField: string, options: any[] };
    fileField?: string;
}
