/*
*@Author Adnane.benkouider
*
*/
import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent  {
  private static _title = '';
  private static _yes = 'Yes';
  private static _no = 'Cancel';
  private static _content = '';

  get title(): string {
    return ConfirmComponent._title;
  }

  get yes(): string {
    return ConfirmComponent._yes;
  }

  get no(): string {
    return ConfirmComponent._no;
  }
  get content(): string {
    return ConfirmComponent._content;
  }

  static setTitle(title: string) {
   ConfirmComponent._title = title;
    return  this;
  }
  static setYes(yes: string) {
    ConfirmComponent._yes = yes;
    return this;
  }
  static setNo(no: string) {
    ConfirmComponent._no = no;
    return this;
  }
  static setContent(content: string) {
    ConfirmComponent._content = content;
    return this;
  }
  constructor(public modal: NgbActiveModal) {}
}


