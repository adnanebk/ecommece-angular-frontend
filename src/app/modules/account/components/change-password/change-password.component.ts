import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {MustMatch} from "../../../../shared/validators/mustMatch";
import {ToastrService} from "ngx-toastr";
import {AppUser} from "../../../../core/models/app-user";
import {UserService} from "../../../../core/services/user.service";
import {ApiError} from "../../../../core/models/api-error";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    form!: FormGroup;
    user!: AppUser;

    constructor(private userService: UserService, private toastrService: ToastrService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            currentPassword: new FormControl(null, Validators.required),
            newPassword: new FormControl(null, Validators.required),
            newPasswordConfirm: new FormControl(null, [Validators.required, MustMatch('newPassword', 'mustMatch', 'password not match')]),
        });
    }


    changePassword() {
        this.form.clearValidators();
        this.form.markAsPristine();
        this.userService.updateUserPassword(this.form.getRawValue())
            .subscribe(() => this.toastrService.success('your password has been changed successfully'),
                error => this.setErrors(error));
    }


    private setErrors(error: ApiError) {
        error.errors?.forEach(err => this.form.setErrors({[err.fieldName]: err.message}))
    }
}
