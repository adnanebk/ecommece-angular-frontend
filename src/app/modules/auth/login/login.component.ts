import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../../core/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {NotificationService} from "../../../core/services/notification.service";
import {AuthenticationService} from "../../../core/services/authentication.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;
    loading!: boolean;
    private error: any ;
    private returnUrl = '/';
    private state: any;
    constructor(private router: Router,private route:ActivatedRoute,
                private titleService: Title,
                private notificationService: NotificationService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.redirectIfUserLoggedIn();

        this.titleService.setTitle('Login');
        this.createForm();
    }

    private redirectIfUserLoggedIn() {
       // this.authService.userSubject.subscribe((user) => user && this.router.navigate(["/"]));
        this.route.queryParams.subscribe(params => this.returnUrl = params['return']);
    }

    private createForm() {

        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required)
        });
    }

    login() {
       console.log(this.loginForm.getRawValue());
        this.authService.login(this.loginForm.getRawValue()).subscribe(
            () => {
                this.state ? this.router.navigate([this.returnUrl], {state: {...this.state}}) :
                    this.router.navigateByUrl(this.returnUrl);
            }, (err) => {
                this.error = err;
            }
        );
    }

    getError() {
        return this.error?.message;
    }

    async googleLogin() {
        await this.authService.loginWithGoogle();
        await this.router.navigateByUrl('/');

    }

    async facebookLogin() {
        await this.authService.loginWithFacebook();
        await this.router.navigateByUrl('/');
    }
    resetPassword() {
        this.notificationService.openSnackBar('dfdfgdhhhfdh');
        //this.router.navigate(['/auth/password-reset-request']);
    }
}
