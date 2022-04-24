import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent  {

  @Output() upload=new EventEmitter<File>();
  constructor() { }



    uploadFile(input: HTMLInputElement) {
    if(!input.files)
      return;
      const file = input.files[0];

      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
       this.upload.emit(file);
      });
      reader.readAsDataURL(file);

    }
}
