import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ConfirmDialogService} from '../../services/confirm-dialog.service';


@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.css']
})
export class EditableTableComponent implements OnChanges {
  @Input() Data: any[] = [];
  @Input() selects = new Selects();
  @Input() batchEnabled = false;
  @Input() fields: Field[];
  @Input() columnNames: string[];
  @Input() errors: any[];
  @Output() dataUpdated = new EventEmitter<number>();
  @Output() dataAdded = new EventEmitter();
  @Output() dataDeleted = new EventEmitter<{ index: number, data: any }>();
  @Output() dataSorted = new EventEmitter<{ sort: string, direction: string }>();
  @Output() fileUploaded = new EventEmitter<{ file: File, index: number,completionFunc: (index: number)=>void }>();
  @Output() UpdateAll = new EventEmitter<any[]>();
  @Output() RemoveAll = new EventEmitter<any[]>();
   isFileUploading: boolean[]=[];
   selectedSize=0;
   prevElement: any={};

  fileNames: string[] = [];

  constructor(private datePipe: DatePipe, private confirmDialogService: ConfirmDialogService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.errors) {
      this.Data.map(e => {
        if (e.isEditing)
          e.hasError = true;
        return e;
      });
    }
  }

  onSave(index: number) {
    this.errors = [];
    this.Data[index].hasError = false;
    this.Data[index].isNew ? this.dataAdded.emit() : this.dataUpdated.emit(index);
  }

  insertNewRow() {
    if (!this.Data[0].isNew) {
      let newEl: any={};
      newEl.isNew=true;
      newEl.isEditing = true;
      this.Data.unshift(newEl);
    }
  }


  remove(index: any) {
    if (this.Data[index].isNew)
      this.Data.splice(index,1);
    else
    this.confirmDialogService.confirmThis(() => {
        this.errors = [];
        this.dataDeleted.emit({index, data: this.Data[index]});
    });
  }

  getText(el: any, name: any,type: string) {
    let val = el[name];
    if(el.isNew)
      return val;
     if (val?.length > 60) {
      return val.substring(0, 60)+'...';
    }
    if (type==='date') {
      return this.datePipe.transform(val, 'short');
    }
     if (type==='select') {
      return val[this.selects.get(name)?.displayField];
    }
     if (type === 'bool') {
      return val ? 'Yes' : 'No';
    }
    return val;
  }
  onValueChanged(index: number, field: any) {
    this.Data[index].dirty = true;
    this.removeError(field.name);
  }
  onViewChanged(currentEl: any) {
    this.prevElement.isEditing=false;
    currentEl.isEditing=true;
    this.prevElement=currentEl;
  }


  processFile(index: number, fieldName: string, input: HTMLInputElement) {
    this.errors = [];
    const file: File = input.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.Data[index].dirty = true;
      //this.isFileUploading[index] = true;
      this.isFileUploading[index]=true;
      this.fileUploaded.emit({file, index,completionFunc:(idx =>this.onFileUploaded(idx) )});
      //this.editedElement[fieldName] = file.name;
      this.fileNames[index] = file.name;
    });
    reader.readAsDataURL(file);
  }


  sort(idx: number, element: HTMLElement) {
    let direction = '';
    if (element.classList.contains('fa-sort-up')) {
      direction = 'desc';
      element.classList.replace('fa-sort-up', 'fa-sort-down');
    } else if (element.classList.contains('fa-sort-down')) {
      element.classList.replace('fa-sort-down', 'fa-sort-up');
      direction = 'asc';
    } else {
      element.classList.add('fa-sort-up');
      direction = 'asc';
    }
    this.dataSorted.emit({sort: this.fields[idx].name, direction});
  }


  onElSelected(el: any) {
   el.selected?this.selectedSize++:this.selectedSize--;
  }

  deleteAll() {
    if(this.selectedSize>0)    {
      this.confirmDialogService.confirmThis(() => {
        this.errors = [];
        this.RemoveAll.emit(this.Data.filter(e => e.selected));
      });
      this.selectedSize=0;

    }

  }

  saveAll() {
    this.errors = [];
    let data= this.Data.filter(e => e.dirty);
    data.length && this.UpdateAll.emit(data);
  }

  getError(idx: number,fieldName: string) {
    const error = this.errors.find(er => er.fieldName === fieldName);
    return error &&  ('"'+this.columnNames[idx]+ '" ' + error.message);
  }

  removeError(fieldName: string) {
    this.errors = this.errors.filter(er => er.fieldName !== fieldName);
  }


  onAllSelected(check: HTMLInputElement) {
    if (check.checked) {
      this.selectedSize=this.Data.length;
      this.Data.map(e => e.selected = true);
    } else {
      this.selectedSize=0;
      this.Data.map(e => e.selected = false);
    }
  }

  trackByFn(index: number, item: any): string {
    return item.id;
  }

  byId(item1, item2) {
    return ((item1 && item2) && item1.id === item2.id) || item1 === item2;
  }


   onFileUploaded= (idx: number)=> {
    this.isFileUploading[idx]=false;
  }
}

export class Selects extends Map<string, { title?: string, displayField: string, valueField: string, options: any[] }> {

}

export interface Field {
  name: string;
  type?: string;
  readOnly?: boolean;
}
