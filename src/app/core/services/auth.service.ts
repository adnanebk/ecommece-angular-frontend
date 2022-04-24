import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {AppUser} from "../models/app-user";
import {AuthData, UserService} from "./user.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<AppUser | null>(null);
  private isToastOpened = false;
    public isTokenExpired = false;


  constructor(private userService: UserService, private socialAuthService: SocialAuthService, private toastrService: ToastrService) {
      const authData =  this.getAuthDataFromStorage();
      authData && this.userSubject.next(authData.appUser);
    }
   isUserAuthenticated():boolean{
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
    return  this.userService.login(user).pipe(
      tap(response => {
        this.saveAuthDataToStorage(response);
      })
    );
  }

  getAuthenticatedUser() {
    return  this.userSubject.asObservable();
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
    let appUser = this.mapUser(socialUser);
     await this.userService.googleLogin({appUser, token: socialUser.idToken}).pipe(tap(response => {
       this.saveAuthDataToStorage(response);
     })).toPromise();
  }

  async loginWithFacebook() {
    const socialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    let appUser = this.mapUser(socialUser);
    await this.userService.facebookLogin({appUser, token: socialUser.authToken}).pipe(tap(response => {
      this.saveAuthDataToStorage(response);
    })).toPromise();
  }

  updateUserInformation(user: AppUser) {
     const authData =  this.getAuthDataFromStorage();
     if(authData){
         authData.appUser=user;
         this.saveAuthDataToStorage(authData);
     }
     else this.logout();

  }

   enableUser() {
      let localUser = this.getCurrentUser();
      if(localUser && !localUser.enabled){
        this.userService.getByEmail(localUser.email).subscribe(user=>{
            if(user.enabled)
            {
                this.toastrService.success('you have successfully verified your account');
                user.enabled=true;
                this.updateUserInformation(user);
            }
        });


      }

  }

  refreshJwtToken() {
      this.isTokenExpired=true;
      const token = this.getAuthDataFromStorage()?.refreshToken ?? '';
      return this.userService.refreshMyToken(token).pipe(
         tap(resp => {
          this.saveAuthDataToStorage(resp);
          this.toastrService.info("new token has been requested");
        })
      );
  }

  sendCompleteRegistrationNotification() {
      this.isToastOpened = true;
      let toast = this.toastrService.info('Please complete your registration by activating your account in your email messages or click here to resend the activation code',
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

    getToken() {
   return this.getAuthDataFromStorage()?.token;
    }

    isSocialUser() {
        return this.getCurrentUser()?.social;
    }

  private mapUser(socialUser: SocialUser):AppUser {
      console.log('social-',socialUser)
    const {firstName,lastName,email,photoUrl} = socialUser;
    return {firstName,lastName,email,imageUrl:photoUrl} ;
  }

  private saveAuthDataToStorage(authData:AuthData) {
          localStorage.setItem('auth-data', JSON.stringify(authData));
          this.userSubject.next(authData.appUser);
          this.isTokenExpired=false;
      }



    private getAuthDataFromStorage():AuthData | undefined {
       const jsonData =localStorage.getItem('auth-data');
        return jsonData && JSON.parse(jsonData);
    }

  private getCurrentUser() {
    return this.userSubject.value;
  }
  private sendActivationMessage() {
    return this.userService.sendActivationMessage(this.getCurrentUser()!.email);
  }


    isAdminUser() {
        return this.getCurrentUser()?.roles?.some(role=>role.name.includes('ADMIN'));
    }
}
