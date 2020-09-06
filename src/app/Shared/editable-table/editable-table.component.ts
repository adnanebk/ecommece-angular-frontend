import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.css']
})
export class EditableTableComponent implements OnChanges {
  @Input() Data: any[];
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
  @Output() dataDeleted = new EventEmitter<any>();
  @Output() dataSorted = new EventEmitter<{sort: string, direction: string}>();
  @Output() fileUploaded = new EventEmitter<{file: File , index: number}>();
  @Output() UpdateAll = new EventEmitter<any[]>();
  @Output() RemoveAll = new EventEmitter<any[]>();
  @Output() SelectedElements = new EventEmitter<any[]>();

  fileNames: string[] = [];

  constructor(private datePipe: DatePipe) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editedElement && changes.errors && this.errors.length > 0)
    {
      const indexOfEditedField = this.Data.indexOf(this.editedElement);
      this.Data[indexOfEditedField].hasError = true;
      window.scroll(0, 0);
    }
  }

  saveChange() {
    this.errors = [];
    const index = this.Data.indexOf(this.editedElement);
    this.originalField = null ;
    this.editedElement.isPost ? this.dataAdded.emit()
      : this.dataChanged.emit(index);
  }

  add() {
    if (!this.Data[0].isPost)
    {
      this.Data.unshift({...this.newElement, isChanged: true , isPost: true});
      this.editedElement = this.Data[0];
    }
  }


  changeValue(index: number, field: any, event: any) {
    this.Data[index].dirty = true;
    if (field.type === 'number')
    {
      if (isNaN(event.target.value))
      {
        event.target.value = this.Data[index][field.name];
        return;
      }
      this.Data[index][field.name] = event.target.value;
      return;
    }
    else if ( field.type === 'bool'){
      this.Data[index][field.name] = event.target.checked;
      return;
    }
    this.Data[index][field.name] = event.target.value;
  }

  remove(idx: any) {
    if (!this.Data[idx].isPost) {
        this.errors = [];
        this.dataDeleted.emit(this.Data[idx]);
      }
    this.Data.splice(idx, 1);
  }
  getSting(val: any, type: string) {
    if (val?.length > 60)
    {
      return  val.substring(0, 60);
    }
    if (type === 'date')
    {
      return  this.datePipe.transform(val, 'short');
    }
    return val;
  }

  changeView(elem: any, $event: MouseEvent) {
    if ($event.target !== $event.currentTarget)
    {
      return;
    }

    if (this.editedElement !== elem)
    {

      if (this.originalField) {
        this.Data[this.Data.indexOf(this.editedElement)] = {...this.originalField};
      }
      this.originalField = {...elem};
      this.editedElement = elem;
    }

  }



  processFile(index: number, fieldName: string, input: HTMLInputElement) {
    this.errors=[];
    const file: File = input.files[0];
    const reader = new FileReader();
    reader.addEventListener('load',  (event: any) => {
      this.Data[index].dirty = true;
      this.hasFileUploading[index] = true;
      this.fileUploaded.emit({file, index});
      this.editedElement[fieldName] = file.name;
      // this.Data[fieldName] = file.name;
      this.fileNames[index] = file.name;
    });
    reader.readAsDataURL(file);
  }
  sort(idx: number, ic: HTMLElement) {
    let direction = '';
    if (ic.classList.contains('fa-sort-up'))
    {
      direction = 'desc';
      ic.classList.replace('fa-sort-up', 'fa-sort-down');
    }
    else if (ic.classList.contains('fa-sort-down'))
    {
      ic.classList.replace('fa-sort-down', 'fa-sort-up');
      direction = 'asc';
    }
    else
    {
      ic.classList.add('fa-sort-up');
      direction = 'asc';
    }
    this.dataSorted.emit({sort: this.fields[idx].name, direction});
  }


  onElSelected(check: HTMLInputElement, index: number) {
    if (check.checked) {
      this.Data[index].selected = true;
    }
    else {
      this.Data[index].selected = false;
    }
    this.SelectedElements.emit(this.Data.filter(e => e.selected));

  }

  getSelectedSize() {
    return this.Data.filter( e => e.selected).length;
  }

  deleteAll() {
    if (confirm('Are you sure to remove ')) {
      this.errors = [];
    this.RemoveAll.emit(this.Data.filter(e => e.selected));
    }
  }

  saveAll() {
    this.errors = [];
    this.UpdateAll.emit(this.Data.filter(e => e.dirty));
  }

  isDataDirty() {
    return this.Data.find(el => el.dirty);
  }
}
