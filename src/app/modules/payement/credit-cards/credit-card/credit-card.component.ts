import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreditCard} from "../../../../core/models/CreditCard";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent {

  @Input() creditCard!:CreditCard;

  @Output() edit = new EventEmitter<CreditCard>();
  @Output() remove = new EventEmitter<CreditCard>();
  @Output() active = new EventEmitter<boolean>();



  editCard() {
    this.edit.emit(this.creditCard);
  }
  removeCard() {
    this.remove.emit(this.creditCard);
  }

  activeChange($event: MatSlideToggleChange) {
    $event.checked && this.active.emit($event.checked);
  }


}
