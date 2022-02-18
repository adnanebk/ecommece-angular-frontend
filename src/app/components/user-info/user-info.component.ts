import { Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AppUser} from '../../models/app-user';
import {HttpService} from '../../services/http.service';
import {CreditCard} from '../../models/CreditCard';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MyError} from '../../models/my-error';
import {CardNumberFormControl} from '../../Shared/card-number-form-control';
import {MonthYearFormControl} from '../../Shared/month-year-form-control';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],

})
export class UserInfoComponent implements OnInit {
  userForm: FormGroup;
  cardForm: FormGroup;
  user: AppUser;
  cards: CreditCard[] = [];
  selectedCard: CreditCard;
  isUserModifying = false;
  isCardModifying = false;
  errors: MyError[];
    cardNames =[{value:'VISA',label:'Visa'},{value:'MASTERCARD',label:'Master Card'}];
  changePasswordForm=this.formBuilder.group({
    currentPassword:  new FormControl('', [Validators.required]),
    newPassword:  new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private httpService: HttpService,
              private formBuilder: FormBuilder,private toastrService: ToastrService) {

  }

   ngOnInit() {
     this.authService.userSubject.subscribe((user) => {
       this.user = user;
     });
     this.loadCreditCards();
     this.userForm = this.formBuilder.group({
        id: new FormControl(this.user?.id, [Validators.required]),
        firstName: new FormControl(this.user?.firstName, [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl(this.user?.lastName, [Validators.required, Validators.minLength(2)]),
        userName: new FormControl(this.user?.userName, [Validators.required, Validators.minLength(2)]),
        email: new FormControl(this.user?.email, [Validators.required, Validators.email]),
        city: new FormControl(this.user?.city),
        country: new FormControl(this.user?.country),
        street: new FormControl(this.user?.street),
        password: new FormControl('', [Validators.required, Validators.minLength(2)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(2)])
      }
    );
     this.cardForm = this.formBuilder.group({
      id: new FormControl(this.selectedCard?.id, [Validators.required]),
      active: new FormControl(this.selectedCard?.active),
      cardType: new FormControl(null, [Validators.required]),
      cardNumber: new CardNumberFormControl(this.selectedCard?.cardNumber, [Validators.required]),
      expirationDate: new MonthYearFormControl(this.selectedCard?.expirationDate, [Validators.required]),
    });
  }

  loadCreditCards() {
    this.selectedCard = new CreditCard();
    this.isCardModifying = false;
    this.httpService.getCreditCardInfo(this.user?.userName).subscribe((cards) => {
      this.cards = cards;
      this.selectedCard = cards.length > 0 && cards[0];
      this.reloadCardForm();

    });
  }

  updateUserInfo($event: Event) {
    $event.preventDefault();
    let user = this.userForm.getRawValue();
    for (var key in user) {
      (this.userForm.controls[key].pristine) && delete user[key];
    }
    this.httpService.updateUser(user, this.user.id).subscribe((resp) => {
      for (var key in user) {
      this.user[key]=user[key];
      }
      this.authService.reloadUser(this.user);
      this.isUserModifying = false;
    },errors => this.errors=errors);
  }

  handleChange() {
    this.errors = null;
  }


  onAddNewCard() {
    this.clearCardErrors();
    this.isCardModifying = true;
    this.selectedCard = new CreditCard();
    this.cardForm.patchValue(this.selectedCard);
  }


  submitUserCard() {
    this.clearCardErrors();
    let creditCard: CreditCard = this.cardForm.getRawValue();
    if (creditCard) {
      creditCard.cardNumber = creditCard?.cardNumber?.replace(/\-/g, '');
      if (creditCard?.id > 0) {
        this.httpService.updateCreditCard(creditCard).subscribe(() => {
       this.loadCreditCards();
        }, errors => this.errors = errors);
      } else {
        this.httpService.saveCreditCard(creditCard).subscribe(() => {
            this.loadCreditCards();
          }
          , errors => this.errors = errors);
      }
    }
  }

  nextCard() {
    let index = this.cards.indexOf(this.selectedCard);
    if (index < this.cards.length - 1) {
      this.selectedCard = this.cards[++index];
      this.reloadCardForm();
    }
  }

  previousCard() {
    let index = this.cards.indexOf(this.selectedCard);
    if (index > 0) {
      this.selectedCard = this.cards[--index];
      this.reloadCardForm();
    }
  }

  private reloadCardForm() {
    if (this.selectedCard && !this.selectedCard.cardNumber?.includes('-')) {
    this.selectedCard.cardNumber = this.selectedCard.cardNumber.match(new RegExp('.{1,4}', 'g')).join('-');
    }
    this.cardForm.patchValue(this.selectedCard);
  }

  removeCard() {
    this.httpService.removeCreditCard(this.selectedCard.id).subscribe(() => {
      this.cards.splice(this.cards.indexOf(this.selectedCard), 1);
      this.selectedCard = this.cards[0];
      this.reloadCardForm();
    });
  }

  onCardActive() {
    this.httpService.activeCard(this.cardForm.getRawValue()).subscribe(cards=>{
      this.cards=cards;
      this.selectedCard=cards[0];
      this.reloadCardForm();
    });
  }

clearCardErrors(){
  this.cardForm.clearValidators();
  this.cardForm.markAsPristine();
  this.errors = [];
}

  updatePassword($event: any) {
    $event.preventDefault();
    this.errors=[];
    let userPasswords = this.changePasswordForm.getRawValue();
    this.changePasswordForm.reset();
    this.authService.updatePassword(userPasswords).subscribe(
      ()=>this.toastrService.success("you have successfully changed your password"),
       err=>{
      this.errors=err;
    });

  }
}
