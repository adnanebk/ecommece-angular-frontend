import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomMaterialModule} from '../custom-material/custom-material.module';
import {LimitToPipe} from './pipes/limit-to.pipe';
import {LocalDatePipe} from './pipes/local-date.pipe';
import {LayoutComponent} from './layout/layout.component';
import {EditableTableComponent} from "./editable-table/editable-table.component";
import {ConfirmComponent} from "./confirm-dialogue/confirm.component";
import {AppInputComponent} from "./input/app-input.component";
import {SelectComponent} from "./select/select.component";
import {FileInputComponent} from "./file-input/file-input.component";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {AutosizeModule} from "ngx-autosize";
import { TableFormComponent } from './editable-table/table-form/table-form.component';

@NgModule({
    imports: [
        RouterModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NgbPaginationModule,
        AutosizeModule,
    ],
    declarations: [
        LimitToPipe,
        LocalDatePipe,
        LayoutComponent,
        EditableTableComponent,
        ConfirmComponent,
        AppInputComponent,
        SelectComponent,
        FileInputComponent,
        TableFormComponent,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        CustomMaterialModule,
        LimitToPipe,
        LocalDatePipe,
        AppInputComponent,
        FileInputComponent,
        SelectComponent,
        EditableTableComponent,
        LayoutComponent,
    ]
})
export class SharedModule {
}
