import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {BehaviorSubject, catchError, lastValueFrom, map, of} from 'rxjs';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {AppUser} from "../models/app-user";
import {AuthData, UserService} from "./user.service";
import {ToastrService} from "ngx-toastr";
import {SocialUserLogin} from "../models/socialUserLogin";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authData = new BehaviorSubject<AuthData | null>(null);
    public isTokenExpired = false;
     isToastrShow=false;

    constructor(private userService: UserService, private socialAuthService: SocialAuthService, private toastrService: ToastrService,private router: Router) {
        const authData = this.getAuthDataFromStorage();
        authData && this.authData.next(authData);
    }

    isUserAuthenticated(): boolean {
        return Boolean(this.getCurrentUser());
    }

    register(user: AppUser) {
        return this.userService.register(user).pipe(
            tap(authData => {
                this.saveAuthDataToStorage(authData);
                this.sendCompleteRegistrationNotification();
            })
        );
    }

    login(userLogin: {email:string,password:string}) {
        return this.userService.login(userLogin).pipe(
            tap(authData => {
                this.saveAuthDataToStorage(authData);
            })
        );
    }

    getAuthenticatedUser() {
        return this.authData.asObservable().pipe(map(authData=>authData?.appUser));
    }

    isUserEnabled() {
        return Boolean(this.getCurrentUser()?.enabled);
    }

    logout() {
        this.authData.next(null);
        localStorage.removeItem('auth-data');
        this.router.navigateByUrl('/auth/login');
    }


    async loginWithGoogle() {
        const socialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
        await lastValueFrom(this.userService.googleLogin(this.mapSocialUser(socialUser))
            .pipe(tap(response => {
                this.saveAuthDataToStorage(response);
            })));
    }

    async loginWithFacebook() {
        const socialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
        await lastValueFrom(this.userService.facebookLogin(this.mapSocialUser(socialUser))
            .pipe(tap(response => {
                this.saveAuthDataToStorage(response);
            })));
    }

    updateUserInformation(user: AppUser) {
        const authData = this.getAuthDataFromStorage();
        authData!.appUser = user;
        this.saveAuthDataToStorage(authData!);


    }

    enableUser(code:string) {
       return  this.userService.enableUserAccount(code).pipe(
           tap(()=>{
            this.toastrService.success('you have successfully activated your account');
            const user  = this.getCurrentUser();
            user!.enabled=true;
            this.updateUserInformation(user!);
        }));
    }

    refreshJwtToken() {
        this.isTokenExpired = true;
        const refreshToken = this.getAuthDataFromStorage()?.refreshToken ?? '';
        if (!refreshToken) {
            this.logout();
        }

        return this.userService.refreshMyToken(refreshToken).pipe(
            tap(authData => {
                if(this.isToastrShow)
                    return;
                this.saveAuthDataToStorage(authData);
                this.isTokenExpired = false;
                const toastr=this.toastrService.info("token has just been refreshed")
                toastr.onShown.subscribe(()=>this.isToastrShow=true);
                toastr.onHidden.subscribe(()=>this.isToastrShow=false);
            }),
            catchError(async er => {
                    this.logout();
                    return er;
                }
            ))
    }

    sendCompleteRegistrationNotification() {
        if(this.isToastrShow)
           return
        let toast = this.toastrService.info('Activate your account to see the full features',
            'Activate your account', {
                timeOut: 10000,
                extendedTimeOut: 3000,
            });
        toast.onShown.subscribe(()=>this.isToastrShow=true)
        toast.onHidden.subscribe(()=>this.isToastrShow=false);
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
    private mapSocialUser(socialUser: SocialUser): SocialUserLogin {
        const {firstName, lastName, email, photoUrl, provider, authToken, idToken} = socialUser;
        return {firstName, lastName, email, image: photoUrl, token: provider === 'GOOGLE' ? idToken : authToken};
    }

    private saveAuthDataToStorage(authData: AuthData) {
        localStorage.setItem('auth-data', JSON.stringify(authData));
        this.authData.next(authData);
    }


    private getAuthDataFromStorage(): AuthData | undefined {
        if(this.authData.value)
            return this.authData.value;
        const jsonData = localStorage.getItem('auth-data');
        return jsonData && JSON.parse(jsonData);
    }

    private getCurrentUser() {
        return this.authData.value?.appUser;
    }
}
