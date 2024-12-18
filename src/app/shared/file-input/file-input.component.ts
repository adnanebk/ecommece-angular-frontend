import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl} from "@angular/forms";

@Component({
    selector: 'app-file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {

    @Output() upload = new EventEmitter<File>();
    @Output() uploadMulti = new EventEmitter<File[]>();
    @Input() accepts: string[] = [];
    @Input() text = 'choose';
    @Input() label = '';
    @Input() control: AbstractControl = new FormControl();
    @Input() isMultiple = false;

    uploadFile(input: HTMLInputElement) {
        if(!input?.files?.length)
            return;
    if (!this.isMultiple) {
            const file = input.files[0];

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.upload.emit(file);
                this.text = file.name;
                this.control.patchValue(this.text);
            });
            reader.readAsDataURL(file);
    }
    else {
            let files : File[] = [];
        for (let i = 0; i < input.files.length; i++) {
            files.push(input.files[i])
        }
            const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.uploadMulti.emit(files);
                this.text = files[0].name;
                this.control.patchValue(this.text);
            });
        reader.readAsDataURL(files[input.files.length-1]);
    }


    }

    ngOnInit(): void {
        if (!this.text)
            this.text = '/Choose a file';
    }

}
