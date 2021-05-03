import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {ConfirmDialogService} from '../services/confirm-dialog.service';


@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.css']
})
export class EditableTableComponent implements OnChanges {
  @Input() Data: any[]=[];
  editedElement: any;
  @Input() batchEnabled = false;
  originalField: {};
  @Input() fields: any[];
  @Input() hasFileUploading: boolean[];
  @Input() columnNames: string[];
  @Input() options: any;
  @Input() newElement: any;
  @Input() errors: any[];
  @Output() dataChanged = new EventEmitter<number>();
  @Output() dataAdded = new EventEmitter();
  @Output() dataDeleted = new EventEmitter<{ index: number, data: any }>();
  @Output() dataSorted = new EventEmitter<{ sort: string, direction: string }>();
  @Output() fileUploaded = new EventEmitter<{ file: File, index: number }>();
  @Output() UpdateAll = new EventEmitter<any[]>();
  @Output() RemoveAll = new EventEmitter<any[]>();
  @Output() SelectedElements = new EventEmitter<any[]>();

  fileNames: string[] = [];

  constructor(private datePipe: DatePipe, private confirmDialogService: ConfirmDialogService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editedElement && changes.errors) {
      const indexOfEditedField = this.Data.indexOf(this.editedElement);
      this.Data[indexOfEditedField].hasError = true;
    }
  }


  onSave(index: number) {
    this.errors = [];
    this.Data[index].isNew ? this.dataAdded.emit() : this.dataChanged.emit(index);
  }

  insertToTable($event: MouseEvent) {
    $event.stopPropagation();
    if (!this.Data[0].isNew) {
      this.Data.unshift({...this.newElement, isNew: true});
      this.editedElement = this.Data[0];
    }
  }


  changeValue(index: number, field: any, event: any) {
    this.Data[index].dirty = true;
    this.removeError(field.name);

    if (field.type === 'number') {
      if (isNaN(event.target.value)) {
        event.target.value = this.Data[index][field.name];
      } else {
        this.Data[index][field.name] = event.target.value;
      }
    } else if (field.type === 'bool') {
      this.Data[index][field.name] = event.target.checked;
    } else {
      this.Data[index][field.name] = event.target.value;
    }
  }

  remove(index: any) {
    this.confirmDialogService.confirmThis(() => {
      if (!this.Data[index].isNew) {
        this.errors = [];
        this.dataDeleted.emit({index, data: this.Data[index]});
      }
    });
  }

  getSting(val: any, type: string) {
    if (val?.length > 60) {
      return val.substring(0, 60);
    }
    if (type === 'date') {
      return this.datePipe.transform(val, 'short');
    }
    return val;
  }

  changeView(elem: any, $event: MouseEvent) {

    if(this.batchEnabled){
      this.editedElement = elem;
      return;
    }

    if (this.editedElement !== elem) {
      if (this.originalField) {
        this.Data[this.Data.indexOf(this.editedElement)] = {...this.originalField};
      }

      this.originalField = {...elem};

       this.editedElement = elem;
    }

  }


  processFile(index: number, fieldName: string, input: HTMLInputElement) {
    this.errors = [];
    const file: File = input.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.Data[index].dirty = true;
      this.hasFileUploading[index] = true;
      this.fileUploaded.emit({file, index});
      this.editedElement[fieldName] = file.name;
      this.fileNames[index] = file.name;
    });
    reader.readAsDataURL(file);
  }

  sort(idx: number, ic: HTMLElement) {
    let direction = '';
    if (ic.classList.contains('fa-sort-up')) {
      direction = 'desc';
      ic.classList.replace('fa-sort-up', 'fa-sort-down');
    } else if (ic.classList.contains('fa-sort-down')) {
      ic.classList.replace('fa-sort-down', 'fa-sort-up');
      direction = 'asc';
    } else {
      ic.classList.add('fa-sort-up');
      direction = 'asc';
    }
    this.dataSorted.emit({sort: this.fields[idx].name, direction});
  }


  onElSelected(check: HTMLInputElement, index: number) {
    if (check.checked) {
      this.Data[index].selected = true;
    } else {
      this.Data[index].selected = false;
    }
    this.SelectedElements.emit(this.Data.filter(e => e.selected));

  }

  getSelectedSize() {
    return this.Data.filter(e => e.selected).length;
  }

  deleteAll() {
    if (confirm('Are you sure to remove ')) {
      this.errors = [];
      this.RemoveAll.emit(this.Data.filter(e => e.selected));
    }
  }

  saveAll($event?: MouseEvent) {
    $event.stopPropagation();
    this.errors = [];
    this.UpdateAll.emit(this.Data.filter(e => e.dirty));
  }

  isDataDirty() {
    return this.Data.find(el => el.dirty);
  }

  getError(fieldName: string) {
    const error = this.errors.find(er => er.fieldName === fieldName);
    return error && error.name + ' ' + error.message;
  }

  removeError(fieldName: string) {
    this.errors = this.errors.filter(er => er.fieldName !== fieldName);
  }


  onAllSelected(check: HTMLInputElement) {
    if (check.checked) {
      this.Data.map(e => e.selected = true);
    } else {
      this.Data.map(e => e.selected = false);
    }
  }

  trackByFn(index: number, prop: any): string {
    return prop.id;
  }

}
