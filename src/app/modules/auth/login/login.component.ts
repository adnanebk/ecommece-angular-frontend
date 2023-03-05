import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../../core/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {Location} from "@angular/common";
import {ApiError} from "../../../core/models/api-error";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;
    loading!: boolean;
    errors: ApiError[] = [];

    constructor(private router: Router, private location: Location,
                private titleService: Title,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.redirectIfUserLoggedIn();
        this.titleService.setTitle('Login');
        this.createForm();
    }


    private createForm() {
        this.loginForm = new FormGroup({
            email: new FormControl('admin@email.com', [Validators.required]),
            password: new FormControl('admin', Validators.required)
        });
    }

    login() {
        this.authService.login(this.loginForm.getRawValue()).subscribe(
            () => this.redirect()
            , (err) => {
                this.errors = err;
                console.log(err)
            }
        );
    }

    hasError() {
        return this.errors.length;
    }

    getErrorMessage() {
        return this.errors[0].message;
    }

    async googleLogin() {
        await this.authService.loginWithGoogle();
        await this.redirect();

    }

    async facebookLogin() {
        await this.authService.loginWithFacebook();
        await this.redirect();
    }

    private redirectIfUserLoggedIn() {
        this.authService.isUserAuthenticated() && this.router.navigateByUrl('/');
    }

    private async redirect() {
        await this.router.navigateByUrl('/');
        // this.location.back();
    }
}
