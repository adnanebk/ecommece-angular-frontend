import {Injectable} from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {AppUser} from "../models/app-user";
import {userService} from "./user.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userSubject = new BehaviorSubject<AppUser | null>(null);
  private isToastOpened = false;


  constructor(private userService: userService, private socialAuthService: SocialAuthService, private toastrService: ToastrService) {

     const user =  this.getAuthenticatedUser();
      this.userSubject.next(user);

      console.log("currentUser", user);

    }

  register(user: AppUser) {
     return this.userService.register(user).pipe(
      tap(response => {
        this.saveToLocalStorage(response.appUser, response.token, response.refreshToken);
         this.verifyUser();
      })
    );
  }

  login(user: any) {
    return  this.userService.login(user).pipe(
      tap(response => {
        this.saveToLocalStorage(response.appUser, response.token, response.refreshToken);
        this.verifyUser();
      })
    );
  }

  getUserInfo() {
    return  this.userService.getByUserName(this.userSubject.value!.userName);
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('appUser');
    localStorage.removeItem('token');
  }


  async loginWithGoogle() {
    const socialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    let appUser = this.mapUser(socialUser);
     await this.userService.googleLogin({appUser, token: socialUser.idToken}).pipe(tap(response => {
       this.saveToLocalStorage(response.appUser, response.token, response.refreshToken);
     })).toPromise();
  }

  async loginWithFacebook() {
    const socialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    let appUser = this.mapUser(socialUser);
    await this.userService.facebook({appUser, token: socialUser.authToken}).pipe(tap(response => {
      this.saveToLocalStorage(response.appUser, response.token, response.refreshToken);
    })).toPromise();
  }

  updatePassword(userPasswords: any) {
    return this.userService.updateUserPassword(userPasswords);
  }

  sendActivationMessage() {
    return this.userService.sendActivationMessage(this.userSubject.value!.email);
  }

  sendConfirmedWithSuccess() {
    this.toastrService.success('you have successfully verified your account');
    const user = this.userSubject.value!;
    user.enabled=true;
    this.saveToLocalStorage(user);
  }

  verifyTokenExpiration() {
    if (new Date() > new Date(this.userSubject.value!.expirationDate!)) {
      let refreshToken = localStorage.getItem('refreshToken');
      this.userService.refreshMyToken(refreshToken!).subscribe(resp => {
          this.saveToLocalStorage(resp.appUser, resp.token, resp.refreshToken);
          window.location.reload();
        }, err => this.logout()
      );
    }
  }

  verifyUser() {
    if (!this.userSubject.value!.enabled && !this.isToastOpened) {
      this.isToastOpened = true;
      let toast = this.toastrService.info('Please complete your registration by activating your account in your email messages or click here te resend the activation code',
        'Activate your account', {
          timeOut: 10000,
          extendedTimeOut: 3000,
        });
      toast.onTap.subscribe(() => {
            this.sendActivationMessage().subscribe(() => this.toastrService.info('We have just sent you a confirmation link,check your email messages'));
        }
      );
      toast.onHidden.subscribe(() => this.isToastOpened = false);

    }
  }


  private mapUser(socialUser: SocialUser):AppUser {
    const {firstName,lastName,email} = socialUser;
    return {firstName,lastName,email,userName:firstName} ;
  }
  private getAuthenticatedUser() {
    const currentUser = localStorage.getItem('appUser');
    return currentUser && JSON.parse(currentUser);
  }
  private saveToLocalStorage(user: AppUser, token?: string, refreshToken?: string) {
    token && localStorage.setItem('token', token);
    refreshToken && localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('appUser', JSON.stringify(user));
    this.userSubject.next(user);
  }
}
