import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";
import {MustMatch} from "../../../shared/validators/mustMatch";
import {ApiError} from "../../../core/models/api-error";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;

    constructor(private authService: AuthService, private router: Router) {
        this.createForm();

    }

    ngOnInit(): void {
        this.redirectIfUserLoggedIn();
        this.createForm();
    }


    onSubmit() {
        this.registerForm.clearValidators();
        this.registerForm.markAsPristine();

        this.authService.register(this.registerForm.value).subscribe((user) => this.redirect(),
            (err) => {
                this.setErrors(err);
            }
        );
    }


    private createForm() {
        this.registerForm = new FormGroup({
                firstName: new FormControl(null, [Validators.required, Validators.minLength(2)]),
                lastName: new FormControl(null, []),
                email: new FormControl(null, [Validators.required, Validators.email]),
                password: new FormControl(null, [Validators.required, Validators.minLength(2)]),
                confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(2)
                    , MustMatch('password', 'mustMatch', 'password not match')]),
            },
        );
    }

    private redirectIfUserLoggedIn() {
        this.authService.isUserAuthenticated() && this.redirect();
    }

    private async redirect() {
        await this.router.navigateByUrl('/');
    }

    private setErrors(error: ApiError) {
        error.errors?.forEach(err => this.registerForm.setErrors({[err.fieldName]: err.message}))
    }


}
