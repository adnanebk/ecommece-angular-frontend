import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl} from "@angular/forms";

@Component({
  selector: 'app-input',
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.scss']
})
export class AppInputComponent implements OnInit {

  @Input()  control!: AbstractControl;
  @Input() translatedText = '';
  @Input() type = 'text';
  @Input() name = '';
  @Input() disabled = false;
  @Input() selectLabel = '';
  @Input() placeholder = '';
  @Input() selectValue = '';
  @Input() required = false;
  @Input() trackedProperty = '';
  @Input() errors: any[] = [];
  @Input() items: any[] = [];
  //@Input() displayData: any[] = [];
  @Output() inputChanged = new EventEmitter<any>();
  apiError: any;
  InputType = InputType;


  get formControl(): FormControl {
    return this.control as FormControl;
  }

  constructor(private cdref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.checkRequiredInputs();
    this.cdref.detectChanges();
  }


  hasError() {
    if (this.control) {
      const {dirty, touched, errors} = this.control;
      return (dirty && touched && errors);
    }
    return false;
  }

  onInputChange(val?: any) {
    console.log(val);
    this.inputChanged.emit(val);
  }

  trackByFn(item: any): number {
    return item[this.trackedProperty]!;
  }

  hasAnyApiError() {
    this.apiError = Array.isArray(this.errors) && this.errors?.find(er => er.fieldName === this.name);
    return this.apiError;
  }

  private checkRequiredInputs() {
    if (!this.control) {
      throw new Error("the attribute 'control' is required");
    }
    if (this.type == 'select') {
      if (this.items.length === 0) {
        throw new Error("the attribute 'items' is required for type select");
      }
    }
  }
}

export enum InputType {
  'text', 'textArea', 'select', 'date', 'number'
}
