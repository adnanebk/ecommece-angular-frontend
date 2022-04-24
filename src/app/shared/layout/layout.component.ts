import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { timer } from 'rxjs';
import { Subscription } from 'rxjs';

import { SpinnerService } from '../../core/services/spinner.service';
import {AuthService} from "../../core/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
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
    isAdmin: boolean = false;

    private autoLogoutSubscription: Subscription = new Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef,private cartService:CartService,
        private media: MediaMatcher,
        public spinnerService: SpinnerService,
        private authService: AuthService,private router: Router,private activatedRoute: ActivatedRoute) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();

        this.mobileQuery.addListener(this._mobileQueryListener);

        this.verifyUser();

    }

    ngOnInit(): void {
        this.authService.getAuthenticatedUser().subscribe(user=>this.userName=user?.firstName!);
    }

    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    logout() {
        this.authService.logout();
    }

    isLoggedIn() {
        return this.authService.isUserAuthenticated();
    }

    getCartItemsCount(){
      return this.cartService.cartSize;
    }

    async login() {
      await  this.router.navigateByUrl('auth/login')
    }

    private verifyUser() {
        this.activatedRoute.queryParamMap.subscribe(params=>params.has("verified") && this.authService.enableUser())
    }

    isAdminUser() {
        return this.authService.isAdminUser();
    }
}