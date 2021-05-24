/*
*@Author Adnane.benkouider
*
*/
import {Component, Input, OnInit} from '@angular/core';
import {ConfirmDialogService} from '../../services/confirm-dialog.service';


@Component({
  selector: 'app-dialog',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  message: any;
  @Input() yes = 'Yes';
  @Input() text = '';
  @Input() no = 'No';

  constructor(
    private confirmDialogService: ConfirmDialogService
  ) {
  }

  ngOnInit(): any {
    /**
     *   This function waits for a message from alert service, it gets
     *   triggered when we call this from any other component
     */
    this.confirmDialogService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

}
