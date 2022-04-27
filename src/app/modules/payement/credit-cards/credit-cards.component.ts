import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreditCard} from "../../../core/models/CreditCard";
import {CardNumberFormControl} from "../../../shared/form-controls/card-number-form-control";
import {MonthYearFormControl} from "../../../shared/form-controls/month-year-form-control";
import {CreditCardService} from "../../../core/services/credit-card.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmComponent} from "../../../shared/confirm-dialogue/confirm.component";
import {ApiError} from "../../../core/models/api-error";

@Component({
  selector: 'app-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent implements OnInit {
  cardForm!: FormGroup;

  cardNames: any[] = [];
  errors: ApiError[]=[];
  constructor(public dialog: MatDialog,private creditCardService:CreditCardService, private modalService:NgbModal) {
    this.cardNames=this.creditCardService.getCardNames();
  }
  @ViewChild('cardEdit') cardEditingModal!:TemplateRef<any>

  creditCards:CreditCard[]=[];
  isNewCard = true;


  ngOnInit(): void {
    this.createForm();
    this.getCurrenCreditCards();
  }

  handleRemove(card: CreditCard,index:number) {
    this.modalService.open(ConfirmComponent.setTitle('confirmation').setContent('Are you sure to delete ?')).closed.subscribe(()=>{
      this.creditCards.splice(index, 1);
      this.creditCardService.removeCreditCard(card.id).subscribe(undefined, () => this.creditCards.splice(index, 0, card));
    })
  }
  handleActive(creditCard: CreditCard) {
    this.creditCardService.activeCard(creditCard.id).subscribe(()=>{
      const activateCard = this.creditCards.find(card=>card.active);
      activateCard!.active=false;
      creditCard.active=true;
    },()=>creditCard.active=false)
  }
  handleSubmit() {
    this.errors=[];
    this.isNewCard?this.save():this.update();
  }

  save() {
    const _card = this.cardForm.getRawValue();
        this.creditCardService.saveCreditCard(_card).subscribe(card=> {
             this.creditCards.push(card);
             this.dialog.closeAll();
           },error => this.errors= Array.from(error));
  }

  update() {
      const _card = this.cardForm.getRawValue();
      this.creditCardService.updateCreditCard(_card).subscribe(card=>{
      const  index =this.creditCards.findIndex(c=>c.id===card.id);
      this.creditCards[index]=card;
      this.dialog.closeAll();
    },error => this.errors= Array.from(error));
  }
  addNew() {
    this.errors=[];
    this.isNewCard=true;
    this.createForm();
    const dialogRef = this.openDialog();
    dialogRef.afterClosed().subscribe();
  }
  edit(creditCard: CreditCard) {
    this.errors=[];
    this.isNewCard=false;
    const dialogRef = this.openDialog();
    dialogRef.afterOpened().subscribe(() => {
      this.cardForm.patchValue(creditCard);
    });
  }

  private openDialog() {
    return this.dialog.open(this.cardEditingModal, {
      width: '400px'
    });
  }
  private createForm() {
    this.cardForm = new FormGroup({
      id: new FormControl(null),
      cardType: new FormControl(null, [Validators.required]),
      cardNumber: new CardNumberFormControl(null, [Validators.required]),
      expirationDate: new MonthYearFormControl(null, [Validators.required]),
    });
  }

  getApiError(fieldName:string) {
    const apiError =  this.errors.find(err => err.fieldName ===fieldName);
    return apiError?.message;
  }

  private getCurrenCreditCards() {
     this.creditCardService.getCreditCards().subscribe(cards=>this.creditCards=cards);
  }
}

