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
    console.log('selects--', this.selects);
    if (changes.errors) {
      this.Data.map(e => {
        if (e.isEditing) {
          e.hasError = true;
        }
        return e;
      });

    }
  }


  onSave(index: number) {
    this.errors = [];
    this.Data[index].hasError = false;
    this.Data[index].isNew ? this.dataAdded.emit() : this.dataChanged.emit(index);
  }

  insertToTable($event: MouseEvent) {
    $event.stopPropagation();
    this.Data[0].isEditing = true;
    if (!this.Data[0].isNew) {
      this.Data.unshift({...this.newElement, isNew: true});
      this.Data[0].isEditing = true;
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

  getSting(el: any, name: any) {
    let val = el[name];
    if (val?.length > 60) {
      return val.substring(0, 60);
    }
    if (Date.parse(val)) {
      return this.datePipe.transform(val, 'short');
    }
    if (this.selects.get(name)) {
      return val[this.selects.get(name).displayField];
    }
    if (typeof val === 'boolean') {
      return val ? 'Yes' : 'No';
    }
    return val;
  }
  onValueChanged(index: number, field: any) {
    this.Data[index].dirty = true;
    this.removeError(field.name);
  }
  onViewChanged(currentEl: any) {
      this.Data = this.Data.map(el => {
        el.isEditing = (el === currentEl);
        return el;
      });
      currentEl.hasError = false;
  }


  processFile(index: number, fieldName: string, input: HTMLInputElement) {
    this.errors = [];
    const file: File = input.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.Data[index].dirty = true;
      this.hasFileUploading[index] = true;
      this.fileUploaded.emit({file, index});
      //this.editedElement[fieldName] = file.name;
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


  onElSelected() {
    this.SelectedElements.emit(this.Data.filter(e => e.selected));

  }

  getSelectedSize() {
    return this.Data.filter(e => e.selected).length;
  }

  deleteAll() {
    this.confirmDialogService.confirmThis(() => {
      this.errors = [];
      this.RemoveAll.emit(this.Data.filter(e => e.selected));
    });
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

  byId(item1, item2) {
    return ((item1 && item2) && item1.id === item2.id) || item1 === item2;
  }


}

export class Selects extends Map<string, { title?: string, displayField: string, valueField: string, options: any[] }> {

}

export interface Field {
  name: string;
  type?: string;
  readOnly?: boolean;
}
