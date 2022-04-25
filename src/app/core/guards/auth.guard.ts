import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService) { }

   async canActivate()
    {

  if(this.authService.isUserAuthenticated() && this.authService.isUserEnabled())
    return true;

       await this.router.navigateByUrl('auth/login');
       if(this.authService.isUserAuthenticated() && !this.authService.isUserEnabled())
           this.authService.sendCompleteRegistrationNotification();

    return false;
    }
}
