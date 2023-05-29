import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl} from "@angular/forms";
import {MatFormFieldAppearance} from "@angular/material/form-field/form-field";

@Component({
    selector: 'app-input',
    templateUrl: './app-input.component.html',
    styleUrls: ['./app-input.component.scss']
})
export class AppInputComponent implements OnInit{

    @Input() control: AbstractControl = new FormControl();
    @Input() label = '';
    @Input() placeHolder = '';
    @Input() inputType: InputType = 'text'
    @Input() matIcon = '';
    @Input() readonly = false;
    hidePassword = true;
    @Input() appearance: MatFormFieldAppearance = 'outline';
    @Output() changeValue = new EventEmitter<any>();


    get formControl(): FormControl {
        return this.control as FormControl;
    }


    hasError() {
        if (this.formControl) {
            const {dirty, touched, errors} = this.formControl;
            return (dirty && touched && errors);
        }
        return false;
    }


    onChange(value: any) {
        this.hasError()
        this.changeValue.emit(value);
    }

    ngOnInit(): void {
        console.log(this.formControl)
    }
}


export declare type InputType = 'text' | 'textArea' | 'date' | 'number' | 'password' | 'decimal';

