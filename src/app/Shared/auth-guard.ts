import {AuthService} from '../services/auth.service';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AppUser} from '../models/app-user';

@Injectable()
export class AuthGuard {
  private user: AppUser;


  constructor(private authService: AuthService, private router: Router) {

    this.authService.userSubject.subscribe((user) => {
      this.user = user;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.user) {
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }, state: {...this.router.getCurrentNavigation().extras.state}
      });
    }
    return true;


  }
}
