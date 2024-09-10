import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Schema} from "../models/schema";

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html'
})
export class TableFormComponent {

  @Input() myForm!: FormGroup
  @Input() field!: Schema

  @Output() uploadFile = new EventEmitter<any>();


  uploadImage($event: File) {
    this.uploadFile.next($event)
  }
  getFormControl(name: string) {
    return this.myForm.controls[name] as FormControl;
  }
  compareWith(item1: any, item2: any): boolean {
    return (item1 && item2) ? item1.id === item2.id : item1 === item2;
  }
}
