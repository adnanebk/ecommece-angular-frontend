import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreditCard} from "../../../../core/models/CreditCard";
import {CardOption, CreditCardService} from "../../../../core/services/credit-card.service";
import {CardNumberFormControl} from "../../../../shared/form-controls/card-number-form-control";
import {MonthYearFormControl} from "../../../../shared/form-controls/month-year-form-control";
import {ApiError} from "../../../../core/models/api-error";

@Component({
  selector: 'app-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  styleUrls: ['./credit-card-form.component.css']
})
export class CreditCardFormComponent {
  cardForm!: FormGroup;
  cardOptions: CardOption[] = [{cardType: 'VISA', name: 'Visa'}, {cardType: 'MASTERCARD', name: 'Master Card'}];
  private _selectedCard?: CreditCard;
  @Output() addNewCard = new EventEmitter<CreditCard>();
  @Output() updateCard = new EventEmitter<CreditCard>();
  cards: CreditCard[]=[];


  @Input() set selectedCard(creditCard: CreditCard) {
    this._selectedCard = creditCard;
    if(!creditCard)
      this.cardForm.reset();
    else this.cardForm.patchValue(creditCard);

  }

  constructor(private creditCardService:CreditCardService) {
    this.createForm();
    this.creditCardService.getCreditCards().subscribe(cards=> {
      this.cards = cards;
    });
  }



  isCardNumberChanged() {
    return this._selectedCard?.cardNumber !== this.cardForm.get('cardNumber')?.value?.replaceAll('-', '');
  }
  handleSubmit() {
    if(this.cardForm.invalid)
      return;
    this.isNewCard ? this.save() : this.update();
  }

  save() {
        this.creditCardService.saveCreditCard(this.cardForm.getRawValue()).subscribe(card => {
          this.addNewCard.next(card);
        }, error => this.setErrors(error));
  }

  update() {
    const card:CreditCard = this.cardForm.getRawValue();
    this.creditCardService.updateCreditCard(card).subscribe(() => {
      this.updateCard.next(card);
    }, error => this.setErrors(error));
  }

  get isNewCard() {
    return !Boolean(this._selectedCard?.id);
  }

  private createForm() {
    this.cardForm = new FormGroup({
      id: new FormControl(null),
      cardType: new FormControl(null, [Validators.required]),
      cardNumber: new CardNumberFormControl(null,[Validators.required]),
      expirationDate: new MonthYearFormControl(null, [Validators.required]),
    });
  }

  private setErrors(error: ApiError) {
    error.errors?.forEach(err => {
      this.cardForm.setErrors({[err.fieldName]: err.message})
    })
  }

   validateCardNumber(cardNumber:any) {
          const formValue = cardNumber.replaceAll('-', '');
          if(formValue==this._selectedCard?.cardNumber)
            return;
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
