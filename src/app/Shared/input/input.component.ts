import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() control: AbstractControl;
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() data: [];


  constructor() {
  }


  ngOnInit(): void {
    // this.formGroup.setControl(this.controlName, this.control);
  }

  showError() {
    const {dirty, touched, errors} = this.control;
    return (dirty && touched && errors );
  }
}

