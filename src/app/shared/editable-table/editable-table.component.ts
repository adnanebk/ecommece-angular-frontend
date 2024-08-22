import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
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
export class EditableTableComponent<T extends Data> implements OnDestroy {
    @Input() enableMultiEditing = false;
    @Input() myForm: FormGroup = new FormGroup({});
    @Output() dataUpdated = new EventEmitter<T>();
    @Output() dataAdded = new EventEmitter<T>();
    @Output() dataDeleted = new EventEmitter<T>();
    @Output() dataSorted = new EventEmitter<{ sort: string, direction: string }>();
    @Output() UpdateAll = new EventEmitter<T[]>();
    @Output() RemoveAll = new EventEmitter<T[]>();

    datasource: DataSource<T> = new DataSource<T>([],[]);
    isBatchEnabled = false;
    isDialogOpened = false;
    selectedSize = 0;
    currentElement: T = {} as T;
    subscriptions: Subscription[] = [];
    zoomedImage = '';

    @Input()
    set dataSource(datasource: DataSource<T>){
        if(!datasource)
            return;
        this.datasource = datasource;
        this.handleDatasourceChanges()
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

    ngOnDestroy(): void {
        this.unsubscribeFromAll();
    }

    private handleDatasourceChanges() {
        this.unsubscribeFromAll();
        this.handleRowAdded();
        this.handleRowRemoved();
        this.handleRowsRemoved();
        this.handleRowUpdated();
        this.handleRowsAdded();
        this.handleRowsUpdated();
        this.handleError();
    }
    private unsubscribeFromAll() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
    private handleRowAdded() {
        this.subscriptions.push(this.datasource.onRowAdded.subscribe(row => {
            row.isSaving = false;
            this.datasource.setData([row,...this.data])
            this.dialog.closeAll();
        }));
    }

    private handleRowUpdated() {
        this.subscriptions.push(this.datasource.onRowUpdated.subscribe(row => {
            row.isSaving = false;
            this.datasource.setData(this.data.map(e=>this.haveEqualIds(e,row)?row:e));
            this.dialog.closeAll();
            this.currentElement = {} as T;

        }));
    }

    private handleRowRemoved() {
        this.subscriptions.push(this.datasource.onRowRemoved.subscribe(row => {
            this.datasource.setData(this.data.filter(el=>!this.haveEqualIds(el,row)));
        }));
    }

    private handleRowsAdded() {
        this.subscriptions.push(this.datasource.onRowsAdded.subscribe(rows => {
            this.datasource.setData([...rows,...this.data]);
        }));
    }

    private handleRowsUpdated() {
        this.subscriptions.push(this.datasource.onRowsUpdated.subscribe(rows => {
            this.datasource.setData(this.data.map(row => rows.find(r => this.haveEqualIds(r,row)) || row));
        }));
    }

    private handleRowsRemoved() {
        this.subscriptions.push(this.datasource.onRowsRemoved.subscribe(rows => {
            this.datasource.setData(this.data.filter(el=> !rows.find(e=>this.haveEqualIds(e, el))));
        }));
    }
    handleError() {
        this.subscriptions.push(this.datasource.onRowErrors.subscribe(resp => {
            const element = this.data.find(el => this.haveEqualIds(resp.row,el)) || resp.row;
            element.errors = resp.errors;
            element.isSaving = false;
            resp.errors?.forEach(err => {
                this.myForm.setErrors({[err.fieldName]: err.message});
            })
        }));
    }

    onSave(element: T) {
        element.errors = [];
        element.isSaving = true;
        element.isNewItem ? this.dataAdded.emit(element) : this.dataUpdated.emit(element);
        this.currentElement = element;
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
        el.errors = [];
    }

    onRowClicked(element: T) {
        if (this.isCurrentElement(element) || this.isBatchEnabled)
            return;
        if (!this.currentElement.isSaving)
            this.rollback(this.data.findIndex(e=>this.haveEqualIds(e,this.currentElement)));
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
        this.openDialog();
        this.currentElement = { isNewItem: true } as T;
        this.myForm.reset({});
    }

    handleEdit(element: T) {
        const dialogRef = this.openDialog();
        dialogRef.afterOpened().subscribe(() => {
            this.myForm.patchValue(element);
        });
        dialogRef.afterClosed().subscribe(() => {
            this.isDialogOpened = false;
            element.dirty=false;
        });
        element.isNewItem = false;
        element.dirty = true;
        this.currentElement = element;
        this.isDialogOpened = true;
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
        return this.haveEqualIds(element,this.currentElement);
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

    hasDataChanged(): boolean {
    return this.data.some(el=>el.dirty);
    }

    isColHide(field: Schema) {
        return (field.readOnly && Object.keys(this.currentElement)?.length)
            || (this.isBatchEnabled && field.type == 'image')
            || (field.readOnly && this.isBatchEnabled);
    }

    private haveEqualIds(e: T, el: T): boolean {
        return e[this.identifier] == el[this.identifier];
    }
    private openDialog() {
        if (!this.currentElement.isSaving)
            this.rollback(this.data.findIndex(e=>this.haveEqualIds(e,this.currentElement)));
        return this.dialog.open(this.editingModal, {
            width: '500px'
        });
    }

    rollback(index?: number) {
        this.currentElement = {} as T;
        this.datasource.roleBack(index);
    }

    getFormControl(name: string) {
        return this.myForm.controls[name] as FormControl;
    }

    isRowEditing(el: T, field: Schema) {
        return (this.isCurrentElement(el) || this.isBatchEnabled) && !field.readOnly && !this.isDialogOpened;
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



