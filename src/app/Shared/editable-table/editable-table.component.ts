import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.css']
})
export class EditableTableComponent implements OnInit {

  @Input() Data: any[];
   tableData: any[];
   editedField: any;
   originalField: {index: number , obj: any};
  @Input() fields: any[];
  @Input() columnNames: string[];
  @Input() options: any;
  @Input() newElement: any;
  @Input() errors: any[];
  @Output() dataChanged = new EventEmitter<number>();
  @Output() dataAdded = new EventEmitter();
  @Output() dataDeleted = new EventEmitter<any>();
  @Output() dataSorted = new EventEmitter<{sort: string, direction: string}>();
  @Output() fileUploaded = new EventEmitter<{file: File , index: number}>();

  constructor(private datePipe: DatePipe) {
  }



  ngOnInit(): void {
  }

  saveChange(obj: any) {
    this.originalField = null ;
    obj.isPost ? this.dataAdded.emit()
      : this.dataChanged.emit(this.Data.indexOf(obj));
  }

  add() {
    if (!this.Data[0].isPost)
    {
      this.Data.unshift({...this.newElement, isChanged: true , isPost: true});
      this.editedField = this.Data[0];
    }
  }
  refreshData() {
    this.tableData = [...this.Data];
    /*this.Data.map(el=>{
      return {...el,isChanging:true}
    });*/
  }

  changeValue(index: number, field: any, event: any) {
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
    !this.Data[idx].isPost && this.dataDeleted.emit(this.Data[idx]);
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
 /*   if (this.editedField)
    {
      this.editedField.isChanged = false;
    }*/
    if (this.editedField !== elem)
    {
      if (this.originalField) {
      this.Data[this.originalField.index] = {...this.originalField.obj};
      }
      this.originalField = {index: this.Data.indexOf(elem), obj : {...elem}};
      this.editedField = elem;
    }
   // const data = elem;
  //  elem = elem.isChanged = true;
  }



  processFile(index: number, fieldName: string, input: HTMLInputElement) {
    const file: File = input.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.fileUploaded.emit({ file, index});
      this.Data[index][fieldName] = file.name;
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

}
