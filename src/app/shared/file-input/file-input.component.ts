import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {

    @Output() upload = new EventEmitter<File>();
    @Input() accepts: string[] = [];
    @Input() text = 'choose';
    @Input() label = '';


    uploadFile(input: HTMLInputElement) {
        if (input?.files?.length) {
            const file = input.files[0];

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.upload.emit(file);
                this.text=file.name;
            });
            reader.readAsDataURL(file);
        }


    }

    ngOnInit(): void {
        if (!this.text)
            this.text = '/Choose a file';
    }

}
