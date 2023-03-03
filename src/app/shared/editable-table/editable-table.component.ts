import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subject, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmComponent} from "../confirm-dialogue/confirm.component";


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
  @Input() enableMultiEditing = false;
  @Output() UpdateAll = new EventEmitter<any[]>();
  @Output() RemoveAll = new EventEmitter<any[]>();

  isBatchEnabled = false;
  selectedSize = 0;
  currentElement: DataType = {};
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
   this.subscriptions[i++] = this.datasource.onDataChanged.subscribe(resp=> {
       const {data,type} = resp;
       switch (type) {
           case 'add':
               this.data[0] = data;
               this.currentElement.isNew = false;
               break;
           case 'delete':
               this.datasource.data.splice(this.data.findIndex(r => r[this.identifier] === data[this.identifier]), 1);
               break;
           case 'update':
               const index = this.data.findIndex(r => r[this.identifier] === data[this.identifier]);
               this.data[index] = data;
               this.data[index].isSaving=false;
               break;
           case 'deleteAll':
               this.data.splice(this.data.findIndex(r => r[this.identifier] === data[this.identifier]), 1);
               break;
           case 'addAll':
               data.forEach((r: any) => this.datasource.data.unshift(r))
               break;
           case 'updateAll':
               this.datasource.data = data.map((row: any) => data.find((r: any) => r[this.identifier] === row[this.identifier]) || row);
               break;
       }
    });

      this.subscriptions[i++] =this.datasource.onRowErrors.subscribe(resp=>{
      this.errors= resp;
          this.data[this.data.indexOf(this.currentElement)].isSaving=false;
    });

  }



  insertNewRow(tableContent: HTMLDivElement) {
      tableContent.scrollTop = 0;
    if (!this.data[0].isNew) {
        Object.assign(this.currentElement, this.originalElement);
        this.currentElement = {isNew:true};
        this.fields.forEach(field=>this.currentElement[field.name]=null)
        this.errors = [];
        console.log('----',this.currentElement);
      this.data.unshift(this.currentElement);
    }
  }
  onSave(element:DataType) {
    this.errors = [];
    element.isSaving=true;
    element.isNew ? this.dataAdded.emit(element) : this.dataUpdated.emit(element);
  }

  remove(element: any) {
    this.modalService.open(ConfirmComponent.setTitle('Confirm').setContent('Are you sure to remove this row ?')).closed.subscribe(()=> {
      if (!element[this.identifier]) {
        this.data.splice(0, 1);
      } else {
        this.errors = [];
        this.dataDeleted.emit(element);
      }
    });
  }

  removeAll() {
    this.modalService.open(ConfirmComponent.setContent(this.selectedSize+' row/rows selected, Are you sure to remove them all ?')).closed.subscribe(()=> {
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
        if(this.currentElement.isNew)
        {
            this.data.splice(0,1);
            return;
        }
        Object.assign(this.currentElement, this.originalElement);
        this.currentElement={};
    }
  onViewChanged(element: any) {
    if (this.isCurrentElement(element) || this.isBatchEnabled )
      return;

    this.errors = [];

    if(this.currentElement.isNew)
         this.data.splice(0,1);
    this.currentElement.dirty=false;
      if(!this.currentElement.isSaving){
          // rollback
          Object.assign(this.currentElement, this.originalElement);
      }

    this.currentElement = element;
    this.originalElement = {...element};

  }


  uploadFile(element:DataType, property: string, file: File) {
      console.log('file--',file.name);
    this.errors = [];
    element.dirty = true;
    element[property] = file.name;
    this.datasource.uploadedFiles=this.datasource.uploadedFiles.filter(fl=>fl.property!==property)
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
  trackByFn( item: any): string {
    return item[this.identifier];
  }
  compareWith(item1:any, item2:any): boolean {
    return ((item1 && item2) && item1.id === item2.id) || item1 === item2;
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
    return this.datasource.data;
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

    getSelectedItem(fieldName: string) {
        return this.selects.find(sl=>sl.property===fieldName);
    }
}


export declare type InputType = 'text' | 'number' | 'decimal' | 'bool' | 'date' | 'textArea' | 'image' | 'select';
export class Field {
    constructor(public name: string, public display: string, public type: InputType='text', public  readOnly=false) {
    }

}

export interface ApiError{
  message: string;
  fieldName: string;
}

export class DataSource<Type> {
  fields:Field[]=[];
  data :Type[]= [];
  onRowErrors = new Subject<ApiError[]>();
  onDataChanged = new Subject<{type:'add' | 'update' | 'delete' | 'deleteAll' | 'addAll' | 'updateAll' ,data?: Type | Type[] }>();
  identifier='id'
  totalSize=0;
  uploadedFiles: {property:string,file:File}[]=[];
  nestedObjects: { property:string,displayField: string, valueField: string, options: any[]} []=[];
}

type DataType = any | {
   dirty: boolean;
   isNew: boolean;
   isSaving: boolean;
   selected: boolean;
}


