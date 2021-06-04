import {Injectable} from '@angular/core';
import {AppUser} from '../models/app-user';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {HttpService} from './http.service';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userSubject = new BehaviorSubject<AppUser>(null);
  private currentUser: AppUser;

  constructor(private httpService: HttpService, private socialAuthService: SocialAuthService, private toastrService: ToastrService) {
    const currentUserSt = localStorage.getItem('appUser');
    if (currentUserSt?.length > 0) {
      this.currentUser = JSON.parse(currentUserSt);
      this.verifyUser();
      this.userSubject.next(this.currentUser);
    }
  }

  register(user: any) {
    return this.httpService.register(user).pipe(
      map(response => {
        return this.returnConnectedUser(response);
      })
    );
  }

  login(user: any) {
    return this.httpService.login(user).pipe(
      map(response => {
        return this.returnConnectedUser(response);
      })
    );
  }

  async getUserInfo() {
    return await this.httpService.getUserInfo(this.currentUser.userName).toPromise();
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('appUser');
    localStorage.removeItem('token');
  }

  private returnConnectedUser(response: { token: string; appUser: AppUser }) {
    this.saveUserToLocal(response.appUser);
    localStorage.setItem('token', response.token);
    this.verifyUser();

    return this.currentUser;
  }

  private saveUserToLocal(user: AppUser) {
    localStorage.setItem('appUser', JSON.stringify(user));
    this.userSubject.next(user);
    this.currentUser=user;
  }

  async loginWithGoogle() {
    const socialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    let appUser = this.mapUser(socialUser);
    return this.httpService.googleLogin({appUser, token: socialUser.idToken}).pipe(map(resp => {
      return this.returnConnectedUser(resp);
    }));
  }

  async loginWithFacebook() {
    const socialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    let appUser = this.mapUser(socialUser);
    return this.httpService.facebook({appUser, token: socialUser.authToken}).pipe(map(resp => {
      return this.returnConnectedUser(resp);
    }));
  }


  mapUser(socialUser: SocialUser) {
    let appUser = new AppUser();
    appUser.firstName = socialUser.firstName;
    appUser.lastName = socialUser.lastName;
    appUser.email = socialUser.email;
    appUser.userName = socialUser.firstName + '-' + socialUser.lastName;
    return appUser;
  }

  sendActivationMessage() {
    return this.httpService.sendActivationMessage(this.currentUser.email);
  }

  sendConfirmedWithSuccess() {
    this.toastrService.success('you have successfully verified your account');
    this.currentUser.enabled = true;
    this.saveUserToLocal(this.currentUser);
  }

  verifyUser() {
    if (!this.currentUser.enabled) {
      this.toastrService.info('Please complete your registration by activating your account in your email messages or click here te resend the activation code',
        'Activate your account', {
          timeOut: 10000,
          extendedTimeOut: 3000,
        }).onTap.subscribe(v => {
          if (!this.currentUser.enabled) {
            this.sendActivationMessage().subscribe(
              () => this.toastrService.info('We have just sent you a confirmation link,check your email messages'));
          }
        }
      );
    }
  }

  reloadUser(resp: AppUser) {
  this.saveUserToLocal(resp);
  }
}
