import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {MatFormFieldAppearance} from "@angular/material/form-field/form-field";

@Component({
  selector: 'app-input',
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.scss']
})
export class AppInputComponent  {

  @Input()  control: AbstractControl= new FormControl();
  @Input() label = '';
  @Input() placeHolder = '';
  @Input() inputType : InputType = 'text'
  @Input() matIcon = '';
  @Input() readonly = false;
  hidePassword = true;


  hide= true;
   controlName?: string;
  @Input() appearance: MatFormFieldAppearance='outline';


  get formControl(): FormControl {
    return this.control as FormControl;
  }



  constructor() {
  }




  hasError() {
    if (this.formControl) {
      const {dirty, touched, errors} = this.formControl;
      return (dirty && touched && errors);
    }
    return false;
  }

  onInputChange(val?: any) {
   // this.valueChange.emit(val);
  }


  private checkRequiredInputs() {
    if (!this.formControl)
      throw new Error("the attribute 'control' is required");
  }





}


export declare type InputType = 'text' | 'textArea' | 'date' | 'number' | 'password' | 'decimal';

