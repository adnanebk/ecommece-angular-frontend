import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmComponent } from "../confirm-dialogue/confirm.component";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DataSource } from "./models/data.source";
import { Schema } from "./models/schema";
import { ApiError } from "./models/api.error";


@Component({
    selector: 'app-editable-table',
    templateUrl: './editable-table.component.html',
    styleUrls: ['./editable-table.component.css']
})
export class EditableTableComponent<T extends Data> implements OnInit, OnDestroy {
    @Output() dataUpdated = new EventEmitter<T>();
    @Output() dataAdded = new EventEmitter<T>();
    @Output() dataDeleted = new EventEmitter<T>();
    @Output() dataSorted = new EventEmitter<{ sort: string, direction: string }>();
    @Input() enableMultiEditing = false;
    @Input() myForm: FormGroup = new FormGroup({});
    @Output() UpdateAll = new EventEmitter<T[]>();
    @Output() RemoveAll = new EventEmitter<T[]>();

    datasource: DataSource<T> = new DataSource<T>([],[]);
    isBatchEnabled = false;
    isFormEditing = false;
    selectedSize = 0;
    currentElement: T = {} as T;
    subscriptions: Subscription[] = [];
    isDataChanged = false;
    zoomedImage = '';

    @Input()
    set dataSource(datasource: DataSource<T>){
        if(!datasource)
            return;
        this.datasource = datasource;
        this.myForm = new FormGroup(datasource.schema.reduce((obj: any,current)=>{
            obj[current.name] = current.formControl;
            return obj;
            },{[this.identifier]: new FormControl(null)}));
    }

    constructor(public dialog: MatDialog, private modalService: NgbModal) {
    }

    @ViewChild('elementEdit') editingModal!: TemplateRef<any>;
    @ViewChild('zoomedImages') zoomedImagesModal!: TemplateRef<any>;

     get data(): T[] & any[] {
        return this.datasource.data;
    }

    get identifier() {
        return this.datasource.identifier;
    }

    get schema() {
        return this.datasource.schema || [];
    }

    ngOnInit(): void {
        if(!this.datasource)
            return;
        this.handleDatasourceChanges()
    }
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
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
            this.rolleback();
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
            this.datasource.setData(this.data.map(row => rows.find(r => r[this.identifier] == row[this.identifier]) || row));
        }));
    }

    private handleRowsRemoved() {
        this.subscriptions.push(this.datasource.onRowsRemoved.subscribe(rows => {
            rows.forEach(row => {
                this.data.splice(this.findIndex(row), 1);
            });
            this.backUpData();
        }));
    }

    handleError() {
        this.subscriptions.push(this.datasource.onRowErrors.subscribe(resp => {
            const element = this.data.find(el => el[this.identifier] == resp.row[this.identifier]) || resp.row;
            element.errors = resp.errors;
            element.isSaving = false;
            resp.errors?.forEach(err => {
                this.myForm.setErrors({[err.fieldName]: err.message});
            })
        }));
    }

    private findIndex(row: T) {
        return this.data.findIndex(r => r[this.identifier] === row[this.identifier]);
    }

    onSave(element: T) {
        element.errors = [];
        element.isSaving = true;
        element.isNewItem ? this.dataAdded.emit(element) : this.dataUpdated.emit(element);
    }

    remove(element: T) {
        this.modalService.open(ConfirmComponent.setTitle('Confirm').setContent('Are you sure to remove this row ?')).closed.subscribe(() => {
            if (!element[this.identifier]) {
                this.data.splice(0, 1);
            } else {
                element.errors = [];
                this.dataDeleted.emit(element);
            }
        });
    }

    removeAll() {
        this.modalService.open(ConfirmComponent.setContent(this.selectedSize + ' row/rows selected, Are you sure to remove them all ?')).closed.subscribe(() => {
            if (this.selectedSize > 0) {
                this.RemoveAll.emit(this.data.filter(e => e.selected));
                this.selectedSize = 0;
            }
        });
    }

    updateAll() {
        let modifiedElements = this.data.filter(e => e.dirty);
        modifiedElements.length && this.UpdateAll.emit(modifiedElements);
    }

    onValueChanged(el: T) {
        el.dirty = true;
        this.isDataChanged = true;
        el.errors = [];
    }

    onRowClicked(element: T) {
        if (this.isCurrentElement(element) || this.isBatchEnabled)
            return;
        if (this.currentElement.dirty && !this.currentElement.isSaving)
            this.rolleback();
        element.isNewItem = false;
        this.currentElement = element;
    }

    uploadFile(element: any, field: Schema, file: File) {
        element.dirty = true;
        element[field.name] = file.name;
        element[field.fileField!] = file;
        this.myForm.controls[field.name].patchValue(file);
    }


    sort(sort: string, icon: HTMLElement) {
        let direction = '';
        if (icon.classList.contains('fa-sort-up')) {
            direction = 'DESC';
            icon.classList.replace('fa-sort-up', 'fa-sort-down');
        }
        else {
            icon.classList.remove('fa-sort-down');
            icon.classList.add('fa-sort-up');
            direction = 'ASC';
        }
        this.dataSorted.emit({ sort, direction });
    }

    onElementSelected(el: T) {
        el.selected ? this.selectedSize++ : this.selectedSize--;
    }
    onImageClicked($event: Event, src: string) {
        $event.stopPropagation();
        this.zoomedImage = src;
        this.dialog.open(this.zoomedImagesModal, {
            width: '500px', height: '500px'
        });
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

    addNewItem() {
        this.currentElement = { isNewItem: true } as T;
        this.myForm.reset({});
        const dialogRef = this.openDialog();
        dialogRef.afterClosed().subscribe(() => this.rolleback());
    }

    handleEdit(element: T) {
        element.isNewItem = false;
        element.dirty = true;
        this.currentElement = element;
        const dialogRef = this.openDialog();
        this.isFormEditing = true;
        dialogRef.afterOpened().subscribe(() => {
        this.myForm.patchValue(element);
        });
        dialogRef.afterClosed().subscribe(() => {
            this.isFormEditing = false;
        });
    }
    handleSubmit() {
        if (this.myForm.invalid)
            return;
        Object.assign(this.currentElement, this.myForm.getRawValue());
        this.onSave(this.currentElement);
    }

    hasError(element: T) {
        return element.errors?.length;
    }

    getError(fieldName: string, element: T) {
        return element.errors?.find(err => err.fieldName == fieldName)?.message;
    }

    isCurrentElement(element: any) {
        return element[this.identifier] === this.currentElement[this.identifier];
    }

    hasFocus(element: HTMLElement) {
        return element === document.activeElement;
    }

    trackById(i: any, item: any): string {
        return item?.[this.identifier];
    }
    trackByField(i: any, item: Schema): string {
        return item.name;
    }
    compareWith(item1: any, item2: any): boolean {
        return (item1 && item2) ? item1.id === item2.id : item1 === item2;
    }

    isDirty(el: T) {
        return el.dirty;
    }

    isColHide(field: Schema) {
        return (field.readOnly && Object.keys(this.currentElement)?.length)
            || (this.isBatchEnabled && field.type == 'image')
            || (field.readOnly && this.isBatchEnabled);
    }


    private openDialog() {
        return this.dialog.open(this.editingModal, {
            width: '500px'
        });
    }


    rolleback() {
        this.currentElement = {} as T;
        this.datasource.roleBack();
    }
    backUpData() {
        this.currentElement = {} as T;
        this.datasource.backupData();
    }

    getFormControl(name: string) {
        return this.myForm.controls[name] as FormControl;
    }

    isRowEditing(el: T, field: Schema) {
        return (this.isCurrentElement(el) || this.isBatchEnabled) && !field.readOnly && !this.isFormEditing;
    }

    getField(element: T, field: Schema) {
        return element[field.name];
    }
}

export interface Data {
    isSaving?: boolean,
    isNewItem?: boolean,
    selected?: boolean,
    dirty?: boolean,
    errors?: ApiError[],
    [key: string | symbol]: any;
}
export declare type InputType = 'text' | 'number' | 'decimal' | 'bool' | 'date' | 'textArea' | 'image' | 'select';



