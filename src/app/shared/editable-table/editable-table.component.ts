import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subject, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmComponent} from "../confirm-dialogue/confirm.component";
import {FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";


@Component({
    selector: 'app-editable-table',
    templateUrl: './editable-table.component.html',
    styleUrls: ['./editable-table.component.css']
})
export class EditableTableComponent implements OnInit, OnDestroy {
    @Output() dataUpdated = new EventEmitter<any>();
    @Output() dataAdded = new EventEmitter<any>();
    @Output() dataDeleted = new EventEmitter<any>();
    @Output() dataSorted = new EventEmitter<{ sort: string, direction: string }>();
    @Output() dataPaged = new EventEmitter<{ page: number, pageSize: number }>();
    @Input() datasource!: DataSource<any>;
    @Input() enableMultiEditing = false;
    @Input() myForm: FormGroup = new FormGroup({});
    @Output() UpdateAll = new EventEmitter<any[]>();
    @Output() RemoveAll = new EventEmitter<any[]>();

    isBatchEnabled = false;
    selectedSize = 0;
    currentElement: DataType = {};
    originalElement: any = {};
    errors: { fieldName: string, message: string }[] = [];
    page = 1;
    pageSize = 8;
    subscriptions: Subscription[] = [];
    isNewItem = true;

    constructor(public dialog: MatDialog, private datePipe: DatePipe, private modalService: NgbModal) {
    }

    @ViewChild('elementEdit') editingModal!: TemplateRef<any>

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    ngOnInit(): void {
        this.handleDatasourceChanges()
    }

    private handleDatasourceChanges() {
        this.handleRowAdded();
        this.handleRowRemoved();
        this.handleRowsRemoved();
        this.handleRowUpdated();
        this.handleRowsAdded();
        this.handleRowsUpdated();
        this.handleError();
    }

    private handleRowAdded() {
        this.subscriptions.push(this.datasource.onRowAdded.subscribe(row => {
            this.data[0] = row;
            this.data[0].isSaving = false;
            this.dialog.closeAll();
        }));
    }

    private handleRowUpdated() {
        this.subscriptions.push(this.datasource.onRowUpdated.subscribe(row => {
            const index = this.findIndex(row);
            this.data[index] = row;
            this.data[index].isSaving = false;
            this.dialog.closeAll();
        }));
    }

    private handleRowRemoved() {
        this.subscriptions.push(this.datasource.onRowRemoved.subscribe(row => {
            this.data.splice(this.findIndex(row), 1);
        }));
    }

    private handleRowsAdded() {
        this.subscriptions.push(this.datasource.onRowsAdded.subscribe(rows => {
            rows.forEach(r => this.datasource.data.unshift(r));
        }));
    }

    private handleRowsUpdated() {
        this.subscriptions.push(this.datasource.onRowsUpdated.subscribe(rows => {
            this.datasource.data = this.data.map(row => rows[this.findIndex(row)] || row);
        }));
    }

    private handleRowsRemoved() {
        this.subscriptions.push(this.datasource.onRowsRemoved.subscribe(rows => {
            rows.forEach(row => {
                this.data.splice(this.findIndex(row), 1);
            })
        }));
    }

    handleError() {
        this.subscriptions.push(this.datasource.onRowErrors.subscribe(resp => {
            this.errors = resp;
            const index = this.data.indexOf(this.currentElement);
            if (index >= 0)
                this.data[index].isSaving = false;
        }));
    }

    private findIndex(row: any) {
        return this.data.findIndex(r => r[this.identifier] === row[this.identifier]);
    }

    onSave(element: DataType) {
        this.errors = [];
        element.isSaving = true;
        this.isNewItem ? this.dataAdded.emit(element) : this.dataUpdated.emit(element);
    }

    remove(element: any) {
        this.modalService.open(ConfirmComponent.setTitle('Confirm').setContent('Are you sure to remove this row ?')).closed.subscribe(() => {
            if (!element[this.identifier]) {
                this.data.splice(0, 1);
            } else {
                this.errors = [];
                this.dataDeleted.emit(element);
            }
        });
    }

    removeAll() {
        this.modalService.open(ConfirmComponent.setContent(this.selectedSize + ' row/rows selected, Are you sure to remove them all ?')).closed.subscribe(() => {
            if (this.selectedSize > 0) {
                this.errors = [];
                this.RemoveAll.emit(this.data.filter(e => e.selected));
                this.selectedSize = 0;
            }
        });
    }

    updateAll() {
        this.errors = [];
        let modifiedElements = this.data.filter(e => e.dirty);
        modifiedElements.length && this.UpdateAll.emit(modifiedElements);
    }

    onValueChanged(el: DataType, field: Field) {
        el.dirty = true;
        this.removeError(field.name);
    }

    cancelChange() {
        if (this.currentElement.isNew) {
            this.data.splice(0, 1);
            return;
        }
        Object.assign(this.currentElement, this.originalElement);
        this.currentElement = {};
    }

    onViewChanged(element: any) {
        if (this.isCurrentElement(element) || this.isBatchEnabled)
            return;

        this.errors = [];
        this.isNewItem = false;
        this.currentElement.dirty = false;
        if (!this.currentElement.isSaving) {
            // rollback
            Object.assign(this.currentElement, this.originalElement);
        }

        this.currentElement = element;
        this.originalElement = {...element};

    }


    uploadFile(element: DataType, property: string, file: File) {
        this.errors = [];
        element.dirty = true;
        element[property] = file.name;
        this.datasource.uploadedFiles = this.datasource.uploadedFiles.filter(fl => fl.property !== property)
        this.datasource.uploadedFiles.push({property, file});
    }


    sort(sort: string, icon: HTMLElement) {
        let direction = '';
        if (icon.classList.contains('fa-sort-up')) {
            direction = 'DESC';
            icon.classList.replace('fa-sort-up', 'fa-sort-down');
        } else if (icon.classList.contains('fa-sort-down')) {
            icon.classList.replace('fa-sort-down', 'fa-sort-up');
            direction = 'ASC';
        } else {
            icon.classList.add('fa-sort-up');
            direction = 'ASC';
        }
        this.dataSorted.emit({sort, direction});
    }

    onElementSelected(el: DataType) {
        el.selected ? this.selectedSize++ : this.selectedSize--;
    }

    onAllSelected(checked: boolean) {
        if (checked) {
            this.selectedSize = this.data.length;
            this.data.forEach(e => e.selected = true);
        } else {
            this.selectedSize = 0;
            this.data.forEach(e => e.selected = false);
        }
    }

    hasError() {
        return this.errors.length;
    }

    getError(fieldName: string) {
        const error = this.errors.find(er => er.fieldName === fieldName);
        return error && error?.message;
    }

    removeError(fieldName: string) {
        this.errors = this.errors.filter(er => er.fieldName !== fieldName);
    }

    isCurrentElement(element: any) {
        return element === this.currentElement;
    }

    hasFocus(element: HTMLElement) {
        return element === document.activeElement;
    }

    trackByFn(item: any): string {
        return item[this.identifier];
    }

    compareWith(item1: any, item2: any): boolean {
        return ((item1 && item2) && item1.id === item2.id) || item1 === item2;
    }


    isDirty(el: DataType) {
        return el.dirty && (this.isCurrentElement(el) || this.isBatchEnabled);
    }

    pageChanged(page: number, pageSize: number) {
        this.errors = [];
        this.dataPaged.next({page, pageSize});
    }

    get selects() {
        return this.datasource.nestedObjects;
    }

    get data(): DataType[] {
        return this.datasource.data;
    }

    get identifier() {
        return this.datasource.identifier;
    }

    get fields() {
        return this.datasource.fields;
    }

    get totalSize() {
        return this.datasource.totalSize;
    }

    isColHide(field: Field) {
        return (this.isBatchEnabled && (field.type === 'image' || field.readOnly));
    }

    isSaving(el: DataType) {
        return el.isSaving;
    }

    getSelectedItem(fieldName: string) {
        return this.selects.find(sl => sl.property === fieldName);
    }

    handleSubmit() {
        Object.assign(this.currentElement, this.myForm.getRawValue());
        this.onSave(this.currentElement);
    }

    private openDialog() {
        return this.dialog.open(this.editingModal, {
            width: '400px'
        });
    }

    addNewItem() {
        this.errors = [];
        this.isNewItem = true;
        this.currentElement = {isNew: true};
        this.myForm.reset({});
        const dialogRef = this.openDialog();
        dialogRef.afterClosed().subscribe(() => this.currentElement = {});
    }

    deleteError(fieldName: string) {
        this.errors = this.errors.filter(er => er.fieldName !== fieldName);
    }

    handleEdit(el: any) {
        this.currentElement = el;
        this.isNewItem = false;
        const dialogRef = this.openDialog();
        dialogRef.afterOpened().subscribe(() => {
            this.myForm.patchValue(el);
        });
    }
}


export declare type InputType = 'text' | 'number' | 'decimal' | 'bool' | 'date' | 'textArea' | 'image' | 'select';

export class Field {
    constructor(public name: string, public display: string, public type: InputType = 'text', public readOnly = false) {
    }

}

export interface ApiError {
    message: string;
    fieldName: string;
}

export class DataSource<Type> {
    fields: Field[] = [];
    data: Type[] = [];
    onRowErrors = new Subject<ApiError[]>();
    onRowAdded = new Subject<Type>();
    onRowsAdded = new Subject<Type[]>();
    onRowUpdated = new Subject<Type>();
    onRowsUpdated = new Subject<Type[]>();
    onRowRemoved = new Subject<Type>();
    onRowsRemoved = new Subject<Type[]>();
    identifier = 'id'
    totalSize = 0;
    uploadedFiles: { property: string, file: File }[] = [];
    nestedObjects: { property: string, displayField: string, valueField: string, options: any[] } [] = [];
}

type DataType = any | {
    dirty: boolean;
    isSaving: boolean;
    selected: boolean;
}


