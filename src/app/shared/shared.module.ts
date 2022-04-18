import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomMaterialModule} from '../custom-material/custom-material.module';
import {LimitToPipe} from './pipes/limit-to.pipe';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {
  ContentPlaceholderAnimationComponent
} from './content-placeholder-animation/content-placeholder-animation.component';
import {LocalDatePipe} from './pipes/local-date.pipe';
import {YesNoPipe} from './pipes/yes-no.pipe';
import {LayoutComponent} from './layout/layout.component';
import {TranslocoRootModule} from "../transloco-root.module";
import {ToastrModule} from "ngx-toastr";

@NgModule({
  imports: [
    RouterModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  declarations: [
    ConfirmDialogComponent,
    ContentPlaceholderAnimationComponent,
    LimitToPipe,
    LocalDatePipe,
    YesNoPipe,
    LayoutComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslocoRootModule,
    FlexLayoutModule,
    CustomMaterialModule,
    LimitToPipe,
    ConfirmDialogComponent,
    ContentPlaceholderAnimationComponent,
    LocalDatePipe,
    YesNoPipe
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
