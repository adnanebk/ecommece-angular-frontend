import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Injectable()
export class AdminAuthGuard implements CanActivate {

    constructor(private router: Router,
                private authService: AuthService) {
    }

    async canActivate() {

        if (this.authService.isUserAuthenticated() && this.authService.isAdminUser())
            return true;

        await this.router.navigateByUrl('auth/login');
        return false;
    }
}
