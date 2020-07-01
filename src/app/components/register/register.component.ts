import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MyError} from '../../models/my-error';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {MustMatch} from '../../validators/mustMatch';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  errors: MyError[];


  constructor(private httpService: HttpService, private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      userName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(2)])
  }, {validator: MustMatch('password', 'confirmPassword')}
  );
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.form.clearValidators();
    this.form.markAsPristine();
    this.errors = [];
    this.httpService.saveUser(this.form.value).subscribe(
      (user) => {
        console.log('userr', user);
        this.router.navigateByUrl('/');
      }, (err) => {
        console.log('errrrrr', err);
        this.errors = err;
      }
    );
  }
  getError(fieldName: string) {
    const error = this.errors?.find(er => er.fieldName === fieldName);
    return error && error.name + ' ' + error.message;
  }
}
