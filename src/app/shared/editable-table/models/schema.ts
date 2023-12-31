import {InputType} from "../editable-table.component";

export interface Schema {
    name: string;
    display: string;
    type: InputType;
    readOnly?: boolean;
    selectOptions?: { displayField: string, valueField: string, options: any[] };
    fileField?: string;
}
