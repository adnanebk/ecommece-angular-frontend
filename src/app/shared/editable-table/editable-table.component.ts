import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subject, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmComponent} from "../confirm-dialogue/confirm.component";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Data} from "@angular/router";


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
    @Input()  datasource!: DataSource<any>;
    @Input()  enableMultiEditing = false;
    @Input()  myForm: FormGroup = new FormGroup({});
    @Output() UpdateAll = new EventEmitter<any[]>();
    @Output() RemoveAll = new EventEmitter<any[]>();

    isBatchEnabled = false;
    isFormEditing = false;
    selectedSize = 0;
    currentElement: DataType = {};
    errors: { fieldName: string, message: string }[] = [];
    subscriptions: Subscription[] = [];
    isNewItem = true;
    isDataChanged=false;
    errorRow: DataType;

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
            this.backUpData();
        }));
    }

    private handleRowUpdated() {
        this.subscriptions.push(this.datasource.onRowUpdated.subscribe(row => {
            const index = this.findIndex(row);
            this.data[index] = row;
            this.data[index].isSaving = false;
            this.dialog.closeAll();
            this.backUpData();
        }));
    }

    private handleRowRemoved() {
        this.subscriptions.push(this.datasource.onRowRemoved.subscribe(row => {
            this.data.splice(this.findIndex(row), 1);
            this.backUpData();
        }));
    }

    private handleRowsAdded() {
        this.subscriptions.push(this.datasource.onRowsAdded.subscribe(rows => {
            rows.forEach(r => this.datasource.data.unshift(r));
            this.backUpData();
        }));
    }

    private handleRowsUpdated() {
        this.subscriptions.push(this.datasource.onRowsUpdated.subscribe(rows => {
            this.datasource.setData(this.data.map(row => rows.find(r=>r[this.identifier]==row[this.identifier]) || row));
        }));
    }

    private handleRowsRemoved() {
        this.subscriptions.push(this.datasource.onRowsRemoved.subscribe(rows => {
            //  this.datasource.setData(this.data.filter(row=>!rows.find(r=>r[this.identifier]==row[this.identifier])))
            rows.forEach(row => {
                this.data.splice(this.findIndex(row), 1);
            });
            this.backUpData();
        }));
    }

    handleError() {
        this.subscriptions.push(this.datasource.onRowErrors.subscribe(resp => {
            this.errors = resp.errors;
            this.errorRow=resp.row;
            resp.row.isSaving=false;
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

    onValueChanged(el: DataType, field: Schema) {
        el.dirty = true;
        this.isDataChanged=true;
        this.removeError(field.name);
    }

    onViewChanged(element: any) {
        if (this.isCurrentElement(element) || this.isBatchEnabled)
            return;
        this.rolleback();
        this.errors = [];
        this.isNewItem = false;
        this.currentElement = element;

    }

    uploadFile(element: DataType, field: Schema, file: File) {
        this.errors = [];
        element.dirty = true;
        element[field.name] = file.name;
        element[field.fileField!] = file;
    }


    sort(sort: string, icon: HTMLElement) {
        let direction = '';
        if (icon.classList.contains('fa-sort-up')) {
            direction = 'DESC';
            icon.classList.replace('fa-sort-up', 'fa-sort-down');
        }
        else  {
            icon.classList.remove('fa-sort-down');
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

    hasError(element=this.myForm.getRawValue()) {
        return this.errorRow && this.errorRow[this.identifier]==element[this.identifier] && this.errors.length;
    }

    getError(fieldName: string) {
        const error = this.errors.find(er => er.fieldName === fieldName);
        return error && error?.message;
    }

    removeError(fieldName: string) {
        this.errors = this.errors.filter(er => er.fieldName !== fieldName);
    }

    isCurrentElement(element: any) {
        return element[this.identifier] === this.currentElement[this.identifier];
    }

    hasFocus(element: HTMLElement) {
        return element === document.activeElement;
    }

    trackById(i:any, item: any): string {
        return item && item[this.identifier];
    }
    trackByField(i:any, item: Schema): string {
        return item.name;
    }
    compareWith(item1: any, item2: any): boolean {
        return (item1 && item2) ? item1.id=== item2.id : item1 === item2;
    }


    isDirty(el: DataType) {
        return el.dirty ;
    }

    get data(): DataType[] {
        return this.datasource.data;
    }

    get identifier() {
        return this.datasource.identifier || 'id';
    }

    get fields() {
        return this.datasource.schema;
    }

    isColHide(field: Schema) {
        return (field.readOnly && Object.keys(this.currentElement)?.length)
             ||  (this.isBatchEnabled && field.type == 'image')
             ||   (field.readOnly && this.isBatchEnabled);
    }

    isSaving(el: DataType) {
        return el.isSaving;
    }

    handleSubmit() {
        Object.assign(this.currentElement, this.myForm.getRawValue());
        this.onSave(this.currentElement);
    }

    private openDialog() {
        return this.dialog.open(this.editingModal, {
            width: '500px'
        });
    }

    addNewItem() {
        this.errors = [];
        this.isNewItem = true;
        this.currentElement = {};
        this.myForm.reset({});
        const dialogRef = this.openDialog();
        dialogRef.afterClosed().subscribe(() => this.rolleback());
    }

    deleteError(fieldName: string) {
        this.errors = this.errors.filter(er => er.fieldName !== fieldName);
    }

    handleEdit(el: DataType) {
        this.errors=[];
        this.isNewItem = false;
        const dialogRef = this.openDialog();
        dialogRef.afterOpened().subscribe(() => {
            this.myForm.patchValue(el);
            this.isFormEditing=true;
        });
        dialogRef.afterClosed().subscribe(()=> {
            this.rolleback();
            this.isFormEditing=false;
        });
    }

    rolleback() {
        this.errors=[];
        this.currentElement = {};
        this.datasource.rolleBack();
    }
    backUpData(){
        this.currentElement={};
        this.datasource.backupData();
    }

    getFormControl(name: string) {
        return this.myForm.controls[name] as FormControl;
    }

    isRowEditing(el: Data, field: Schema) {
        return (this.isCurrentElement(el) || this.isBatchEnabled) && !field.readOnly && !this.isFormEditing;
    }
}


export declare type InputType = 'text' | 'number' | 'decimal' | 'bool' | 'date' | 'textArea' | 'image' | 'select';

export interface Schema {
    name: string;
    display: string;
    type: InputType;
    readOnly?: boolean;
    selectOptions?: { displayField: string, valueField: string, options: any[] };
    fileField?: string;
}

export interface ApiError {
    message: string;
    fieldName: string;
}

export class DataSource<Type> {
    schema: Schema[] = [];
    private _data: Type[] = [];
    private backedData: Type[] = [];
    onRowErrors = new Subject<{row:Type,errors:ApiError[] }>();
    onRowAdded = new Subject<Type>();
    onRowsAdded = new Subject<Type[]>();
    onRowUpdated = new Subject<Type>();
    onRowsUpdated = new Subject<Type[]>();
    onRowRemoved = new Subject<Type>();
    onRowsRemoved = new Subject<Type[]>();
    identifier = '';

    get data(): Type[] {
        return this._data;
    }

    public setData(data:Type[]){
        this._data=data;
        this.backupData();
    }
    backupData() {
        this.backedData = [];
        this.data.forEach(e=>this.backedData.push({...e}));

    }
    rolleBack() {
        this._data=[];
        this.backedData.forEach(e=>this._data.push({...e}));
    }
}

type DataType = any | {
    dirty: boolean;
    isSaving: boolean;
    selected: boolean;
}


