import {AuthService} from '../services/auth.service';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
@Injectable()
export class AuthGuard {


  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   const user =  this.authService.getUser();
   console.log('---auth---', this.router.getCurrentNavigation().extras.state);
   if (!user)
   {
     this.router.navigate(['/login'], {
       queryParams: {
         return: state.url
       }, state: {...this.router.getCurrentNavigation().extras.state}
     });
   }
   return true;


  }
}
