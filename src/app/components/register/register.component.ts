import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MyError} from '../../models/my-error';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {MustMatch} from '../../validators/mustMatch';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  state: {};
  errors: MyError[];
  private returnUrl = '/';


  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      userName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(2)])
  }, {validator: MustMatch('password', 'confirmPassword')}
  );
    this.state = this.router.getCurrentNavigation().extras.state;
    this.returnUrl = this.router.getCurrentNavigation().extras.queryParams?.return ?? '/';
    console.log('extra', this.router.getCurrentNavigation().extras);
  }

  ngOnInit(): void {
    console.log(this.returnUrl);
  }

  onSubmit() {
    this.form.clearValidators();
    this.form.markAsPristine();
    this.errors = [];
    this.authService.register(this.form.value).subscribe(
      (user) => {
        console.log('userr', user);
       // this.router.navigateByUrl('/');
        this.state ? this.router.navigate([this.returnUrl], { state: {...this.state} }) :
          this.router.navigateByUrl(this.returnUrl);
      }, (err) => {
        this.errors = err;
      }
    );
  }
  getError(fieldName: string) {
    const error = this.errors?.find(er => er.fieldName === fieldName);
    return error && error.name + ' ' + error.message;
  }
}
