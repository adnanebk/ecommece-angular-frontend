import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.css']
})
export class EditableTableComponent implements OnInit, OnChanges {

  @Input() Data: any[];
   tableData: any[];
   editedField: any;
  @Input() fields: any[];
  @Input() columnNames: string[];
  @Input() options: any;
  @Input() newElement: any;
  @Input() errors: any[];
  @Output() dataChanged = new EventEmitter<any>();
  @Output() dataAdded = new EventEmitter<any>();
  @Output() dataDeleted = new EventEmitter<any>();
  @Output() fileUploaded = new EventEmitter<File>();

  constructor(private datePipe: DatePipe) {
  }

/*  ngOnChanges(changes: SimpleChanges): void {
    console.log('ng data changed ', changes);
    if (changes.Date)
    {
      console.log('ng load data ', changes);
      this.refreshData();
    }
    }*/

  ngOnInit(): void {
    console.log('ng data changed ', this.Data);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ', changes);
  }

  saveChange(obj: any) {
    obj.isPost ? this.dataAdded.emit(obj)
      : this.dataChanged.emit(obj);
  }

  add() {
    this.Data.unshift({...this.newElement, isChanged: true , isPost: true});
    this.editedField = this.Data[0];

  }
  refreshData() {
    console.log('ng data changed ', this.Data);
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

  changeValueOfCheckbox(index: number, property: string, event: any) {
    console.log('checkbox changed', event.target.checked);
    this.Data[index][property] = event.target.checked;
  }
  changeValueOfNumber(index: number, property: string, event: any) {
    if (isNaN(event.target.value))
    {
      event.target.value = this.Data[index][property];
      return;
    }
    this.Data[index][property] = event.target.value;

  }

  remove(id: any) {
    this.Data.splice(id, 1);
    // this.dataDeleted.emit(this.Data[id]);
  }
  getSting(val: any, type: string) {
    if (val?.length > 60)
    {
      return  val.substring(0, 60);
    }
    if (type === 'date')
    {
      return  this.datePipe.transform(val);
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
    this.editedField = elem;
   // const data = elem;
  //  elem = elem.isChanged = true;

    console.log('view changed ', elem);
  }



  processFile(index: number, fieldName: string, input: HTMLInputElement) {
    const file: File = input.files[0];
    const reader = new FileReader();
    console.log(file);
    reader.addEventListener('load', (event: any) => {
      this.fileUploaded.emit(file);
      this.Data[index][fieldName] = file.name;
    });
    reader.readAsDataURL(file);
  }



  update(idx: number) {
    console.log('updating', this.Data[idx]);
    this.dataChanged.emit(this.Data[idx]);
  }

}
