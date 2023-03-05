import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from "@angular/forms";
import {MatFormFieldAppearance} from "@angular/material/form-field/form-field";

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

    @Input() control: AbstractControl = new FormControl();
    @Input() selectLabel = '';
    @Input() defaultSelect = {};
    @Input() readonly = false;
    @Input() haObjectValue = false;
    @Input() selectValue = 'id';
    @Input() items: any[] = [];
    @Input() placeholder = '';
    @Input() appearance: MatFormFieldAppearance = 'outline';

    get formControl(): FormControl {
        return this.control as FormControl;
    }

    ngOnInit(): void {
        this.checkRequiredInputs();
    }

    private checkRequiredInputs() {
        if (!this.formControl) {
            throw new Error("the attribute 'control' is required");
        }
        if (!this.items.length) {
            throw new Error("the attribute 'items' is required for type select");
        }

    }

    compareWith(item1: any, item2: any): boolean {
        return ((item1 && item2) && item1[this.selectValue] === item2[this.selectValue]) || item1 === item2;
    }
}
