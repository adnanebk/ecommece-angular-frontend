import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreditCard} from "../../../core/models/CreditCard";
import {CardOption, CreditCardService} from "../../../core/services/credit-card.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmComponent} from "../../../shared/confirm-dialogue/confirm.component";

@Component({
    selector: 'app-credit-cards',
    templateUrl: './credit-cards.component.html',
    styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent implements OnInit {
    cardNames: CardOption[] = [];
    selectedCard?: CreditCard;
    creditCards: CreditCard[] = [];

    constructor(public dialog: MatDialog, private creditCardService: CreditCardService, private modalService: NgbModal) {
        this.cardNames = this.creditCardService.getCardNames();
    }

    @ViewChild('cardEdit') cardEditingModal!: TemplateRef<any>


    ngOnInit(): void {
        this.getCurrenCreditCards();
    }

    handleRemove(card: CreditCard, index: number) {
        this.modalService.open(ConfirmComponent.setTitle('confirmation').setContent('Are you sure to delete ?')).closed.subscribe(() => {
            this.creditCards.splice(index, 1);
            this.creditCardService.removeCreditCard(card.id).subscribe(undefined, () => this.creditCards.splice(index, 0, card));
        })
    }

    handleActive(creditCard: CreditCard) {
        this.creditCardService.activeCard(creditCard.id).subscribe(() => {
            const activateCard = this.creditCards.find(card => card.active);
            activateCard!.active = false;
            creditCard.active = true;
        }, () => creditCard.active = false)
    }

    save(card:CreditCard) {
            this.creditCards.push(card);
            this.dialog.closeAll();
    }

    update(card:CreditCard) {
            const index = this.creditCards.findIndex(c => c.id === card.id);
            this.creditCards[index] = {...card,active:this.creditCards[index].active};
            this.dialog.closeAll();
    }

    addNew() {
        this.openDialog();
    }

    edit(creditCard: CreditCard) {
      this.openDialog(creditCard)
    }

    private openDialog(selectedCard?:CreditCard) {
        const dialogRef =  this.dialog.open(this.cardEditingModal, {
            width: '400px'
        });
        dialogRef.afterOpened().subscribe(()=>this.selectedCard=selectedCard);
        dialogRef.afterClosed().subscribe(()=>this.selectedCard=undefined);
    }


    private getCurrenCreditCards() {
        this.creditCardService.getCreditCards().subscribe(cards => this.creditCards = cards);
    }




}

