import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiError} from "../../../../core/models/api-error";
import {AuthService} from "../../../../core/services/auth.service";
import {UserService} from "../../../../core/services/user.service";
import {ToastrService} from "ngx-toastr";
import {AppUser} from "../../../../core/models/app-user";

@Component({
    selector: 'app-profile-details',
    templateUrl: './profile-details.component.html',
    styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
    profileForm!: FormGroup;
    user!: AppUser;
    isImageUploading = false;


    constructor(private userService: UserService, private authService: AuthService, private toastrService: ToastrService) {

    }

    ngOnInit(): void {
        this.createForm();
        this.getUserProfile();
    }

    private getUserProfile() {
        this.authService.getAuthenticatedUser().subscribe(user => {
            if (user) {
                this.user = user;
                this.profileForm.patchValue(user);
            }
        })
    }

    onSubmit() {
        this.profileForm.clearValidators();
        this.profileForm.markAsPristine();
        const updatedProfile = this.profileForm.getRawValue();
        Object.keys(updatedProfile).forEach((k) => updatedProfile[k] = updatedProfile[k] === '' ? null : updatedProfile[k]);
        this.userService.updateUserProfile(updatedProfile, this.user.id!).subscribe(() => {
                this.toastrService.success('your profile has been updated successfully');
                this.authService.updateUserInformation(Object.assign(this.user, updatedProfile));
            }, (error: ApiError) => this.setErrors(error)
        );
    }


    private createForm() {
        this.profileForm = new FormGroup({
                email: new FormControl(null, [Validators.required, Validators.email]),
                firstName: new FormControl(null, [Validators.required, Validators.minLength(2)]),
                lastName: new FormControl(null),
                city: new FormControl(null, [Validators.minLength(2)]),
                country: new FormControl(null, [Validators.minLength(2)]),
                street: new FormControl(null, [Validators.minLength(4)]),
            },
        );
    }

    handleFileUpload(file: File) {
        this.isImageUploading = true;
        this.userService.updateImage(file).subscribe(res => {
            this.user.imageUrl = res.url;
            this.isImageUploading = false;
            this.authService.updateUserInformation(this.user)
            this.toastrService.success('you have successfully updated your photo')
        }, err => this.isImageUploading = false)
    }

    private setErrors(error: ApiError) {
        error.errors?.forEach(err => this.profileForm.setErrors({[err.fieldName]: err.message}))
    }
}
