import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subject, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmComponent} from "../confirm-dialogue/confirm.component";
import {PageEvent} from "@angular/material/paginator";





@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.css']
})
export class EditableTableComponent implements OnInit,OnDestroy{

  @Output() dataUpdated = new EventEmitter<any>();
  @Output() dataAdded = new EventEmitter<any>();
  @Output() dataDeleted = new EventEmitter<any>();
  @Output() dataSorted = new EventEmitter<{ sort: string, direction: string }>();
  @Output() dataPaged = new EventEmitter<{page:number,pageSize:number}>();
  @Input() datasource!: DataSource<any>;
  @Output() UpdateAll = new EventEmitter<any[]>();
  @Output() RemoveAll = new EventEmitter<any[]>();

  isBatchEnabled = false;
  selectedSize = 0;
  selectedElements = 0;
  currentElement: any = {};
  originalElement: any = {};
  errors: {fieldName:string,message:string}[] = [];
  page = 1;
  pageSize = 8;
 subscriptions:Subscription[]=[];
  constructor(private datePipe: DatePipe,private modalService:NgbModal) {

  }

  ngOnDestroy(): void {
        this.subscriptions.forEach(sub=>sub.unsubscribe());
    }

  ngOnInit(): void {
    this.handleDatasourceChanges()
  }

    private handleDatasourceChanges() {
    let i = 0;
   this.subscriptions[i++] = this.datasource.onRowAdded.subscribe(row=> {
      this.data[0]=row;
      this.complete(0);
    });
      this.subscriptions[i++] =this.datasource.onRowUpdated.subscribe(row=>{
      const index = this.data.findIndex(r=>r[this.identifier]===row[this.identifier]);
      this.data[index]=row;
      this.complete(index);
    });
      this.subscriptions[i++] =this.datasource.onRowsAdded.subscribe(rows=>{
       this.data.unshift(rows);
    })
      this.subscriptions[i++] =this.datasource.onRowsUpdated.subscribe(rows=>{
      this.datasource.data= this.data.map(row=>rows.find(r=>r[this.identifier]===row[this.identifier]) || row);
    });
      this.subscriptions[i++] =this.datasource.onRowErrors.subscribe(resp=>{
      this.errors= resp;
      this.complete(this.data.indexOf(this.currentElement));
    });
      this.subscriptions[i++] =this.datasource.onRowRemoved.subscribe(row=>{
       const index = this.data.findIndex(r=>r[this.identifier]===row[this.identifier]);
       this.data.splice(index,1);
     });
      this.subscriptions[i++] =this.datasource.onRowsRemoved.subscribe(rows=>{
      rows.forEach(row=>{
        const index = this.data.findIndex(r=>r[this.identifier]===row[this.identifier]);
        this.data.splice(index,1);
      })
    })
  }

  private complete(index:number){
    this.data[index].isSaving=false;
  }

  insertNewRow(tableContent: HTMLDivElement) {
      tableContent.scrollTop = 0;
    if (!this.isNew(this.data[0])) {
        Object.assign(this.currentElement, this.originalElement);
        this.currentElement = {};
      this.data.unshift(this.currentElement);
    }
  }
  onSave(element:DataType) {
    this.errors = [];
    element.isSaving=true;
    this.isNew(element) ? this.dataAdded.emit(element) : this.dataUpdated.emit(element);
  }

  remove(element: any) {
    this.modalService.open(ConfirmComponent.setTitle('Confirm').setContent('Are you sure to remove this row ?')).closed.subscribe((resp)=> {
      if (!element[this.identifier]) {
        this.data.splice(0, 1);
      } else {
        this.errors = [];
        this.dataDeleted.emit(element);
      }
    });
  }

  removeAll() {
    this.modalService.open(ConfirmComponent.setContent(this.selectedSize+' row/rows selected, Are you sure to remove them all ?')).closed.subscribe((resp)=> {
      if (this.selectedSize > 0) {
        this.errors = [];
        this.RemoveAll.emit(this.data.filter(e => e.selected));
        this.selectedSize = 0;
      }
    });
  }

  updateAll() {
    this.errors = [];
    let modifiedElements = this.data.filter(e => e.dirty) ;
    modifiedElements.length && this.UpdateAll.emit(modifiedElements);
  }

  onValueChanged(el: DataType, field: Field) {
    el.dirty = true;
    this.removeError(field.name);
  }
    cancelChange(){
        Object.assign(this.currentElement, this.originalElement);
        this.currentElement={};
    }
  onViewChanged(element: any) {
      this.datasource.uploadedFiles.clear();
    if (this.isCurrentElement(element) || this.isBatchEnabled ) {
      return;
    }
      this.errors = [];
    if(this.isNew(this.currentElement))
    {
         this.data.splice(0,1);
        return;
    }
    this.currentElement.dirty=false;
    // rollback
    Object.assign(this.currentElement, this.originalElement);

    this.currentElement = element;
    this.originalElement = {...element};

  }


  uploadFile(index: number, fieldName: string, file: File) {
    this.errors = [];
    this.data[index].dirty = true;
    this.data[index][fieldName] = file.name;
    this.datasource.uploadedFiles.set(fieldName,file);
  }


  sort(sort: string, icon: HTMLElement) {
    let direction = '';
    if (icon.classList.contains('fa-sort-up')) {
      direction = 'desc';
      icon.classList.replace('fa-sort-up', 'fa-sort-down');
    } else if (icon.classList.contains('fa-sort-down')) {
      icon.classList.replace('fa-sort-down', 'fa-sort-up');
      direction = 'asc';
    } else {
      icon.classList.add('fa-sort-up');
      direction = 'asc';
    }
    this.dataSorted.emit({sort, direction});
  }



  getText(el: any, field: Field) {

    let val = el[field.name];
    return  val?.length > 60?val.substring(0, 60) + '...':field.type === 'date'?this.datePipe.transform(val, 'short')
        :(field.type  === 'select' && this.selects.get(field.name))?val[this.selects.get(field.name)!.displayField]:field.type  === 'bool'?(val ? 'Yes' : 'No'):val ;

  }

  onElementSelected(el: DataType) {
    el.selected ? this.selectedSize++ : this.selectedSize--;
  }
  onAllSelected(checked : boolean) {
    if (checked) {
      this.selectedSize = this.data.length;
      this.data.forEach(e => e.selected = true);
    } else {
      this.selectedSize = 0;
      this.data.forEach(e => e.selected = false);
    }
  }

  hasError(){
    return this.errors.length;
  }

  getError(fieldName: string) {
    const error = this.errors.find(er => er.fieldName === fieldName);
    return error && error?.message;
  }
  removeError(fieldName: string) {
    this.errors = this.errors.filter(er => er.fieldName !== fieldName);
  }
  isCurrentElement(element:any) {
    return element === this.currentElement;
  }
    hasFocus(element:HTMLElement){
      return element===document.activeElement;
    }
  trackByFn(index: number, item: any): string {
    return item[this.identifier];
  }
  compareWith(item1:any, item2:any): boolean {
    return ((item1 && item2) && item1.id === item2.id) || item1 === item2;
  }

  isNew(el: any) {
    return el===this.data[0] && !el[this.identifier];
  }
  isDirty(el: DataType) {
    return el.dirty && (this.isCurrentElement(el) || this.isBatchEnabled);
  }

  pageChanged(page : number, pageSize:number) {
      this.errors=[];
    this.dataPaged.next({page,pageSize});
  }

  get selects(){
    return this.datasource.nestedObjects;
  }
  get data(): DataType[]{
    return this.datasource.data as  DataType[] ;
  }
    get identifier(){
        return this.datasource.identifier;
    }
    get fields(){
        return this.datasource.fields;
    }
  get totalSize(){
    return this.datasource.totalSize;
  }

    isColHide(field: Field) {
        return (this.isBatchEnabled && (field.type==='image' || field.readOnly));
    }

    isSaving(el: DataType) {
        return el.isSaving;
    }
}


export declare type InputType = 'text' | 'number' | 'decimal' | 'bool' | 'date' | 'textArea' | 'image' | 'select';
export interface Field {
  name: string;
  display: string;
  type?: InputType;
  readOnly?: boolean;
}

export interface FileData {
  file: File;
  index: number;
}
export interface ApiError{
  message: string;
  fieldName: string;
}

export class DataSource<Type> {
  fields:Field[]=[];
  data :Type[]= [];
  onRowErrors = new Subject<ApiError[]>();
  onRowAdded = new Subject<Type>();
  onRowsAdded = new Subject<Type[]>();
  onRowUpdated = new  Subject<Type>();
  onRowsUpdated = new  Subject<Type[]>();
  onRowRemoved = new  Subject<Type>();
  onRowsRemoved = new  Subject<Type[]>();
  identifier='id'
  totalSize=0;
  uploadedFiles = new Map<string,File>();
  nestedObjects=new Map<string, {displayField: string; valueField: string; options: any[]}>();

}

type DataType = any & {
   dirty: boolean;
   isSaving: boolean;
   selected: boolean;
}

