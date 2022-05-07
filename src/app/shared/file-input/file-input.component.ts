import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent  {

  @Output() upload=new EventEmitter<File>();
  @Input() accepts: string[] = [];
  @Input() text =  '';


  uploadFile(input: HTMLInputElement) {
    if(input?.files?.length){
      const file = input.files[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.upload.emit(file);
      });
      reader.readAsDataURL(file);
    }


    }
}
