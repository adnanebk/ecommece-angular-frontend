import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';

import {SpinnerService} from '../../core/services/spinner.service';
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";
import {CartService} from "../../core/services/cart.service";
import {environment} from "../../../environments/environment.prod";
import {MatDialog} from "@angular/material/dialog";
import {ApiError} from "../../core/models/api-error";
import { DarkThemeService } from '../darkTheme.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    userName: string = "";
    @ViewChild('confirmationForm') cardEditingModal!: TemplateRef<any>

    private autoLogoutSubscription: Subscription = new Subscription;
    docUrl = environment.api_doc;
    confirmationCode ='';
    errorMessage='';

    get isDarkModeEnabled(){
        return this.darModeService.isDarkModeEnabled;
    }

    constructor(private changeDetectorRef: ChangeDetectorRef, private cartService: CartService,
                private media: MediaMatcher,public dialog: MatDialog,
                public spinnerService: SpinnerService,private darModeService:DarkThemeService,
                private authService: AuthService, private router: Router) {
        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);

    }

    ngOnInit(): void {
        this.authService.getAuthenticatedUser().subscribe(user => this.userName = user?.firstName!);
    }
    
    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }
     openDialog() {
        this.errorMessage='';
        return this.dialog.open(this.cardEditingModal, {
            width: '350px'
        });
    }
    logout() {
        this.authService.logout();
    }

    isLoggedIn() {
        return this.authService.isUserAuthenticated();
    }

    getCartItemsCount() {
        return this.cartService.cartSize;
    }

    async login() {
        await this.router.navigateByUrl('auth/login')
    }

    isAdminUser() {
        return this.authService.isAdminUser();
    }

    isUserEnabled() {
       return Boolean(this.authService.isUserEnabled());
    }

    onChangeCode($event: string) {
        this.confirmationCode=$event;
    }

    onAccountActivation() {
        this.errorMessage='';
        this.authService.enableUser(this.confirmationCode)
            .subscribe(()=>this.dialog.closeAll(),
                (err:ApiError)=>this.errorMessage=err.message);
    }

    sendConfirmationCode() {
        this.authService.sendActivationMessage();
    }


    onThemeChange(checked: boolean) {
        this.darModeService.changeTheme(checked);    
        }
}
