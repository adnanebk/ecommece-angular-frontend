import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private authService: AuthService) {
    }

    async canActivate() {

        if (this.authService.isUserAuthenticated())
            return true;

        await this.router.navigateByUrl('auth/login');
        
        return false;
    }
}
