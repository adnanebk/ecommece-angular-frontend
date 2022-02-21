import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MyError} from '../../models/my-error';
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
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(2)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(2)])
      }, {validator: MustMatch('password', 'confirmPassword')}
    );
    this.state = this.router.getCurrentNavigation().extras.state;
    this.returnUrl = this.router.getCurrentNavigation().extras.queryParams?.return ?? '/';
  }

  ngOnInit(): void {
    this.authService.userSubject.subscribe((user) => user && this.router.navigate(["/"]));
  }

  onSubmit() {
    this.form.clearValidators();
    this.form.markAsPristine();
    this.errors = [];
    this.authService.register(this.form.value).subscribe(
      (user) => {
        // this.router.navigateByUrl('/');
        this.state ? this.router.navigate([this.returnUrl], {state: {...this.state}}) :
          this.router.navigateByUrl(this.returnUrl);
      }, (err) => {
        this.errors = err;
      }
    );
  }


  handleChange() {
    this.errors = null;
  }
}
