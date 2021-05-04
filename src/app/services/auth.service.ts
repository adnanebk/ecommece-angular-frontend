import {Injectable} from '@angular/core';
import {AppUser} from '../models/app-user';
import {map} from 'rxjs/operators';
import {BehaviorSubject, timer} from 'rxjs';
import {HttpService} from './http.service';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userSubject = new BehaviorSubject<AppUser>(null);

  constructor(private httpService: HttpService, private socialAuthService: SocialAuthService) {
    const currentUserSt = localStorage.getItem('appUser');
    if (currentUserSt?.length > 0) {
      const currentUser = JSON.parse(currentUserSt);
      this.userSubject.next(currentUser);
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

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('appUser');
    localStorage.removeItem('token');
  }

  private returnConnectedUser(response: { token: string; appUser: AppUser }) {
    localStorage.setItem('appUser', JSON.stringify(response.appUser));
    localStorage.setItem('token', response.token);
    this.userSubject.next(response.appUser);
    return response.appUser;
  }

  async loginWithGoogle() {
    const socialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    let appUser = this.mapUser(socialUser);
    return this.httpService.googleLogin({appUser, token: socialUser.idToken}).subscribe(resp => {
      return this.returnConnectedUser(resp);
    });
  }

  async loginWithFacebook() {
    const socialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    let appUser = this.mapUser(socialUser);
    return this.httpService.facebook({appUser, token: socialUser.authToken}).subscribe(resp => {
      return this.returnConnectedUser(resp);
    });
  }


  mapUser(socialUser: SocialUser) {
    let appUser = new AppUser();
    appUser.firstName = socialUser.firstName;
    appUser.lastName = socialUser.lastName;
    appUser.email = socialUser.email;
    appUser.userName = socialUser.firstName + '-' + socialUser.lastName;
    return appUser;
  }
}
