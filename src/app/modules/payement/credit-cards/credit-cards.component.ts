import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreditCard} from "../../../core/models/CreditCard";
import {CardOption, CreditCardService} from "../../../core/services/credit-card.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmComponent} from "../../../shared/confirm-dialogue/confirm.component";
import {Observable} from "rxjs";

@Component({
    selector: 'app-credit-cards',
    templateUrl: './credit-cards.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent implements OnInit {
    cardNames: CardOption[] = [];
    selectedCard?: CreditCard;
    creditCards$! : Observable<CreditCard[]>;

    constructor(public dialog: MatDialog, private creditCardService: CreditCardService, private modalService: NgbModal) {
        this.cardNames = this.creditCardService.getCardNames();
    }

    @ViewChild('cardEdit') cardEditingModal!: TemplateRef<any>


    ngOnInit(): void {
        this.creditCards$ = this.creditCardService.getCreditCards();
    }

    handleRemove(card: CreditCard) {
        this.modalService.open(ConfirmComponent.setTitle('confirmation').setContent('Are you sure to delete ?')).closed.subscribe(() => {
            this.creditCardService.removeCreditCard(card).subscribe();
        })
    }

    handleActive(creditCard: CreditCard) {
        this.creditCardService.activeCard(creditCard.id).subscribe();
    }

    handleAdd(card:CreditCard) {
        this.creditCardService.saveCreditCard(card).subscribe(()=>{
            this.dialog.closeAll();
        });
    }

    handleUpdate(cardToUpdate:CreditCard) {
        this.creditCardService.updateCreditCard(cardToUpdate).subscribe(()=>{
            this.dialog.closeAll();   
        })
        
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
        this.selectedCard=selectedCard;
        dialogRef.afterOpened().subscribe();
        dialogRef.afterClosed().subscribe();
    }
}

