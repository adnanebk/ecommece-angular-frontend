import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class CreditCardFormComponent implements OnInit {
  cardForm  = new FormGroup({});
  cardOptions: CardOption[] = [{cardType: 'VISA', name: 'Visa'}, {cardType: 'MASTERCARD', name: 'Master Card'}];
  private _selectedCard?: CreditCard;
  @Input() hideActions=false
  @Output() addNewCard = new EventEmitter<CreditCard>();
  @Output() updateCard = new EventEmitter<CreditCard>();


  @Input() set selectedCard(creditCard: CreditCard) {
    this._selectedCard = creditCard;
    console.log('card form --',creditCard);
    if(!creditCard)
      this.cardForm.reset();
    else
      this.cardForm.patchValue(creditCard);
  }

  constructor(private creditCardService:CreditCardService) {
  }

  ngOnInit(): void {
    this.createForm();

  }

  isCardNumberChanged() {
    return this._selectedCard?.cardNumber !== this.cardForm.get('cardNumber')?.value?.replaceAll('-', '');
  }
  handleSubmit() {
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
      cardNumber: new CardNumberFormControl(null, [Validators.required]),
      expirationDate: new MonthYearFormControl(null, [Validators.required]),
    });
  }

  private setErrors(error: ApiError) {
    error.errors?.forEach(err => {
      this.cardForm.setErrors({[err.fieldName]: err.message})
    })
  }
}
