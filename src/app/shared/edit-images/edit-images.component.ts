import {Component, EventEmitter, Output, TemplateRef, ViewChild} from '@angular/core';
import {CdkDragRelease, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-images',
  templateUrl: './edit-images.component.html',
  styleUrls: ['./edit-images.component.css']
})
export class EditImagesComponent {
  imageUrls: string[] = [];
  @Output() upload = new EventEmitter<File>();
  @Output() change = new EventEmitter<string[]>();

  @ViewChild("zoomedImagesCont") imagesModal!: TemplateRef<any>;

  constructor(public dialog: MatDialog) {
  }

  uploadFile(input: HTMLInputElement) {
    if (!input?.files?.length)
      return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      this.imageUrls.push(event.target?.result as string);
      this.upload.next(file);

    });
    reader.readAsDataURL(file);
  }

  removeImage(image: string) {
    this.imageUrls.splice(this.imageUrls.indexOf(image),1);
    this.change.next(this.imageUrls);
  }

  trackByIndex(i: any, item: any): string {
    return i;
  }

  dropImage($event: CdkDragRelease, startIndex:number) {
    const targetImageUrl = ($event.event.target as HTMLElement).getAttribute('src');
    const endIndex = this.imageUrls.findIndex(img=>img===targetImageUrl);
    moveItemInArray(this.imageUrls, startIndex, endIndex);
    this.change.next(this.imageUrls);
  }


  openDialog(imageUrls: string[]) {
    this.imageUrls = imageUrls
    this.dialog.open(this.imagesModal, {
      width: '400px', height: '400px'
    });
  }
}
