import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Subscription, timer} from 'rxjs';

import {AuthenticationService} from '../../core/services/authentication.service';
import {SpinnerService} from '../../core/services/spinner.service';
import {AuthGuard} from 'src/app/core/guards/auth.guard';
import {CartService} from "../../core/services/cart.service";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {


    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";

    private autoLogoutSubscription: Subscription = new Subscription;
    cartItemsSize = 0;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private cartService: CartService,
        public spinnerService: SpinnerService,
        private authService: AuthenticationService,
        private authGuard: AuthGuard) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.cartService.cartSize.subscribe(size => this.cartItemsSize=size);
        const user = this.authService.getCurrentUser();
        this.userName = user.fullName;




        // Auto logout
        const timer$ = timer(2000, 5000);
        this.autoLogoutSubscription = timer$.subscribe(() => {
            this.authGuard.canActivate();
        });
    }

    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }
}
