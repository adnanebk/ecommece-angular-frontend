import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AppUser} from '../../models/app-user';
import {HttpService} from '../../services/http.service';
import {CreditCard} from '../../models/CreditCard';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../validators/mustMatch';
import {MyError} from '../../models/my-error';
import {CardNumberFormControl} from '../../Shared/card-number-form-control';
import {MonthYearFormControl} from '../../Shared/month-year-form-control';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userForm: FormGroup;
  cardForm: FormGroup;
  user: AppUser;
  cards: CreditCard[]=[];
  selectedCard: CreditCard;
  isUserModifying=false;
  isCardModifying=false;
  errors: MyError[];

  constructor(private authService: AuthService,private httpService: HttpService,private formBuilder: FormBuilder) {

  }

  async ngOnInit() {
   this.user = await this.authService.getUserInfo();
    this.loadCreditCards();
    this.userForm = this.formBuilder.group({
        id: new FormControl(this.user?.id, [Validators.required]),
        firstName: new FormControl(this.user?.firstName, [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl(this.user?.lastName, [Validators.required, Validators.minLength(2)]),
        userName: new FormControl(this.user?.userName, [Validators.required, Validators.minLength(2)]),
        email: new FormControl(this.user?.email,[Validators.required, Validators.email]),
        city: new FormControl(this.user?.city),
        country: new FormControl(this.user?.country),
        street: new FormControl(this.user?.street),
        password: new FormControl('', [Validators.required, Validators.minLength(2)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(2)])
      }, {validator: MustMatch('password', 'confirmPassword')}
    );
    this.cardForm = this.formBuilder.group({
      id: new FormControl(this.selectedCard?.id, [Validators.required]),
      cardType: new FormControl(this.selectedCard?.cardType, [Validators.required]),
      cardNumber: new CardNumberFormControl(this.selectedCard?.cardNumber, [Validators.required]),
      expirationDate: new MonthYearFormControl(this.selectedCard?.expirationDate, [Validators.required]),
    });
}

   loadCreditCards() {
    this.selectedCard=new CreditCard();
    this.isCardModifying=false;
    this.httpService.getCreditCardInfo(this.user.userName).subscribe((cards) => {
      this.cards = cards;
      this.selectedCard = cards.length > 0 && cards[0];
      this.reloadCardForm();

    });
  }

  updateUserInfo($event: Event) {
    $event.preventDefault();
    let user=this.userForm.getRawValue();
    for (var key in user) {
      (!user[key] || user[key]==this.user[key]) && delete user[key];
    }
this.httpService.updateUser(user,this.user.id).subscribe((resp)=>{
  this.user=resp;
  this.userForm.patchValue(resp);
  this.isUserModifying=false;
});
  }

  handleChange() {
    this.errors = null;
  }

  getError(fieldName: string) {
    const error = this.errors?.find(er => er.fieldName === fieldName);
    return error && error.name + ' ' + error.message;
  }

  onAddNewCard() {
    this.isCardModifying=true;
    this.selectedCard=new CreditCard();
    this.cardForm.patchValue(this.selectedCard);
  }


  submitUserCard() {
    let creditCard: CreditCard=this.cardForm.getRawValue();
    if(creditCard){
      creditCard.cardNumber = creditCard?.cardNumber?.replace(/\-/g, '');
      if (creditCard?.id > 0) {
        this.httpService.updateCreditCard(creditCard).subscribe(() =>{
          this.selectedCard=creditCard;
          this.isCardModifying=false;
          this.reloadCardForm();
        });
      } else {
        this.httpService.saveCreditCard(creditCard).subscribe(resp => {
            this.cards.push(resp);
            this.selectedCard=resp;
            this.isCardModifying=false;
            this.reloadCardForm();
          }
          , errors => this.errors = errors);
      }
    }
  }

  nextCard() {
   let index=this.cards.indexOf(this.selectedCard);
   if(index<this.cards.length-1) {
     this.selectedCard=this.cards[++index];
     this.reloadCardForm();
   }
  }
  previousCard() {
    let index=this.cards.indexOf(this.selectedCard);
    if(index>0) {
    this.selectedCard=this.cards[--index];
    this.reloadCardForm();
    }
  }

  private reloadCardForm() {
    if(!this.selectedCard.cardNumber.includes('-'))
    this.selectedCard.cardNumber = this.selectedCard.cardNumber.match(new RegExp('.{1,4}', 'g')).join('-');
    this.cardForm.patchValue(this.selectedCard);
  }

  removeCard() {
    this.httpService.removeCreditCard(this.selectedCard.id).subscribe(()=>{
      this.cards.splice(this.cards.indexOf(this.selectedCard),1);
      this.selectedCard=this.cards[0];
      this.reloadCardForm();
    });

  }


}
