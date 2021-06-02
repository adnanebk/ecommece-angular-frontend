import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {

  @Input() control: AbstractControl;
  @Input() type = 'text';
  @Input() name: string;
  @Input() placeholder: string;
  @Input() errors =[];
  @Input() valueData: [] = [];
  @Input() displayData: [] = [];
  @Output() inputChanged = new EventEmitter<any>();
  apiError ='';

  showError() {
    const {dirty, touched, errors} = this.control;
    return (dirty && touched && errors);
  }

  onInputChange() {
    this.inputChanged.emit();
  }

  hasAnyApiError() {
    let error = Array.isArray(this.errors) && this.errors?.find(er => er.fieldName === this.name);
    this.apiError= error && error.name + ' ' + error.message;
    return this.apiError;

  }
}

