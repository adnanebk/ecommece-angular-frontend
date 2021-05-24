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
  @Input() placeholder: string;
  @Input() valueData: [] = [];
  @Input() displayData: [] = [];
  @Output() inputChanged = new EventEmitter<any>();


  showError() {
    const {dirty, touched, errors} = this.control;
    return (dirty && touched && errors);
  }

  onInputChange() {
    this.inputChanged.emit();
  }
}

