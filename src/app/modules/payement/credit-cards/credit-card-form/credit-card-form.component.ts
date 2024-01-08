import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreditCard} from "../../../../core/models/CreditCard";
import {CardOption} from "../../../../core/services/credit-card.service";
import {CardNumberFormControl} from "../../../../shared/form-controls/card-number-form-control";
import {MonthYearFormControl} from "../../../../shared/form-controls/month-year-form-control";
import {ApiError} from "../../../../core/models/api-error";

@Component({
  selector: 'app-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./credit-card-form.component.css']
})
export class CreditCardFormComponent {
  cardForm!: FormGroup;
  cardOptions: CardOption[] = [{cardType: 'VISA', name: 'Visa'}, {cardType: 'MASTERCARD', name: 'Master Card'}];
  private _selectedCard?: CreditCard;
  @Output() addCard = new EventEmitter<CreditCard>();
  @Output() updateCard = new EventEmitter<CreditCard>();

  @Input() cards: CreditCard[] = []
  @Input() set selectedCard(creditCard: CreditCard) {
    this._selectedCard = creditCard;
    if(!creditCard)
      this.cardForm.reset();
    else this.cardForm.patchValue(creditCard);

  }

  constructor() {
    this.createForm();
  }



  isCardNumberChanged() {
    return this._selectedCard?.cardNumber !== this.cardForm.get('cardNumber')?.value?.replaceAll('-', '');
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
    this.cardForm = new FormGroup({
      id: new FormControl(null),
      cardType: new FormControl(null, [Validators.required]),
      cardNumber: new CardNumberFormControl(null,[Validators.required]),
      expirationDate: new MonthYearFormControl(null, [Validators.required]),
    });
  }

   validateCardNumber(cardNumber:any) {
          const formValue = cardNumber.replaceAll('-', '');
          if(formValue==this._selectedCard?.cardNumber)
            return;
          if(cardNumber?.length<19)
            this.cardForm.setErrors({'cardNumber': 'Invalid card number'});

     const isExist = this.cards.some(card => card.cardNumber == formValue);
     if (isExist && !this.cardForm.hasError('cardNumber'))
            this.cardForm.setErrors({'cardNumber': 'Card number already used'});
  }

  validateExpirationDate(expirationDate:string) {
    const monthYear= expirationDate.split('/')?.map(val=>Number(val));
    if(monthYear?.length<2)
      return;
    const currentDate = new Date();
    const cardDate = new Date(2000+monthYear[1],monthYear[0]-1,currentDate.getDate());
    if(cardDate<=currentDate)
      this.cardForm.setErrors({'expirationDate': 'Expiration date must be in the future'});
  }
}
