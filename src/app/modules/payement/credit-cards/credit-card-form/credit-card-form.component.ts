import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreditCard} from "../../../../core/models/CreditCard";
import {CardOption} from "../../../../core/services/credit-card.service";
import {CardNumberFormControl} from "../../../../shared/form-controls/card-number-form-control";
import {MonthYearFormControl} from "../../../../shared/form-controls/month-year-form-control";
import {CardNumberValidator} from "../../../../shared/validators/cardNumberValidator";
import {ExpirationDateValidator} from "../../../../shared/validators/expirationDateValidator";

@Component({
  selector: 'app-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./credit-card-form.component.css']
})
export class CreditCardFormComponent {

  cardOptions: CardOption[] = [{cardType: 'VISA', name: 'Visa'}, {cardType: 'MASTERCARD', name: 'Master Card'}];
  private _selectedCard?: CreditCard;
  private _cards: CreditCard[]=[];

  @Output() addCard = new EventEmitter<CreditCard>();
  @Output() updateCard = new EventEmitter<CreditCard>();

  @Input() set selectedCard(creditCard: CreditCard) {
    this._selectedCard = creditCard;
    if(!creditCard)
      this.cardForm?.reset();
    else this.cardForm.patchValue(creditCard);

  }
  @Input() set cards(cards: CreditCard[]){
      this._cards=cards || [];
      this.createForm();
  }

  get cards(){
    return this._cards;
  }

  cardForm!: FormGroup;

  constructor(){
    this.createForm();
  }

  isCardNumberChanged() {
    return this._selectedCard?.cardNumber !== this.cardForm?.get('cardNumber')?.value?.replaceAll('-', '');
  }
  handleSubmit() {
    if(this.cardForm.invalid)
      return;
    this.isNewCard ? this.addNew() : this.update();
  }

  addNew() {
          this.addCard.next(this.cardForm.getRawValue());
  }

  update() {
      this.updateCard.next(this.cardForm.getRawValue());
  }

  get isNewCard() {
    return !this._selectedCard?.id;
  }

  private createForm() {
    const controls = {
      id: new FormControl(null),
      cardType: new FormControl(null, [Validators.required]),
      cardNumber: new CardNumberFormControl(null,[Validators.required,CardNumberValidator(this.cards)]),
      expirationDate: new MonthYearFormControl(null, [Validators.required,ExpirationDateValidator]),
    };
    this.cardForm = new FormGroup(controls);
  }
}
