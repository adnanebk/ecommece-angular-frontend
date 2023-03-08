import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {BehaviorSubject, catchError, lastValueFrom} from 'rxjs';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {AppUser} from "../models/app-user";
import {AuthData, UserService} from "./user.service";
import {ToastrService} from "ngx-toastr";
import {SocialUserLogin} from "../models/socialUserLogin";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userSubject = new BehaviorSubject<AppUser | null>(null);
    private isToastOpened = false;
    public isTokenExpired = false;


    constructor(private userService: UserService, private socialAuthService: SocialAuthService, private toastrService: ToastrService) {
        const authData = this.getAuthDataFromStorage();
        authData && this.userSubject.next(authData.appUser);
    }

    isUserAuthenticated(): boolean {
        return Boolean(this.getCurrentUser());
    }

    register(user: AppUser) {
        return this.userService.register(user).pipe(
            tap(response => {
                this.saveAuthDataToStorage(response);
                this.sendCompleteRegistrationNotification();
            })
        );
    }

    login(user: any) {
        return this.userService.login(user).pipe(
            tap(response => {
                this.saveAuthDataToStorage(response);
            })
        );
    }

    getAuthenticatedUser() {
        return this.userSubject.asObservable();
    }

    isUserEnabled() {
        return this.getCurrentUser()?.enabled;
    }

    logout() {
        this.userSubject.next(null);
        localStorage.removeItem('auth-data');
        location.reload();
    }


    async loginWithGoogle() {
        const socialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
        await lastValueFrom(this.userService.googleLogin(this.mapUser(socialUser))
            .pipe(tap(response => {
                this.saveAuthDataToStorage(response);
            })));
    }

    async loginWithFacebook() {
        const socialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
        await lastValueFrom(this.userService.facebookLogin(this.mapUser(socialUser))
            .pipe(tap(response => {
                this.saveAuthDataToStorage(response);
            })));
    }

    updateUserInformation(user: AppUser) {
        const authData = this.getAuthDataFromStorage();
        if (!authData) {
            this.logout();
            return;
        }
        authData.appUser = user;
        this.saveAuthDataToStorage(authData);


    }

    enableUser(code:string) {
       return  this.userService.enableUserAccount(code).pipe(
           tap(()=>{
            this.toastrService.success('you have successfully activated your account');
            const user  = this.getCurrentUser();
            user!.enabled=true;
            this.updateUserInformation(user!);
        }));
 /*       let localUser = this.getCurrentUser();
        if (localUser && !localUser.enabled) {
            this.userService.getCurrentAuthUser().subscribe(user => {
                if (user.enabled) {
                    this.toastrService.success('you have successfully verified your account');
                    user.enabled = true;
                    this.updateUserInformation(user);
                }
            });

        }*/

    }

    refreshJwtToken() {

        this.isTokenExpired = true;
        const token = this.getAuthDataFromStorage()?.refreshToken ?? '';
        if (!token) {
            this.logout();
        }
        return this.userService.refreshMyToken(token).pipe(
            tap(resp => {
                resp = {...resp, appUser: this.getCurrentUser()!};
                this.saveAuthDataToStorage(resp);
                this.isTokenExpired = false;
                this.toastrService.info("token has just been refreshed")
            }),
            catchError(async er => {
                    this.logout();
                    return er;
                }
            ))
    }

    sendCompleteRegistrationNotification() {
        this.isToastOpened = true;
        let toast = this.toastrService.info('Activate your account to see the full features',
            'Activate your account', {
                timeOut: 10000,
                extendedTimeOut: 3000,
            });
        toast.onHidden.subscribe(() => this.isToastOpened = false);
    }

    getToken() {
        return this.getAuthDataFromStorage()?.token;
    }

    isSocialUser() {
        return this.getCurrentUser()?.social;
    }

    isAdminUser() {
        return this.getCurrentUser()?.roles?.some(role => role.name.includes('ADMIN'));
    }
    sendActivationMessage() {
         this.userService.sendActivationMessage(this.getCurrentUser()!.email).subscribe(()=>this.toastrService.info("we have just send you a confirmation code,please verify your email account"));
    }
    private mapUser(socialUser: SocialUser): SocialUserLogin {
        const {firstName, lastName, email, photoUrl, provider, authToken, idToken} = socialUser;
        return {firstName, lastName, email, image: photoUrl, token: provider === 'GOOGLE' ? idToken : authToken};
    }

    private saveAuthDataToStorage(authData: AuthData) {
        localStorage.setItem('auth-data', JSON.stringify(authData));
        this.userSubject.next(authData.appUser);
    }


    private getAuthDataFromStorage(): AuthData | undefined {
        const jsonData = localStorage.getItem('auth-data');
        return jsonData && JSON.parse(jsonData);
    }

    private getCurrentUser() {
        return this.userSubject.value;
    }
}
