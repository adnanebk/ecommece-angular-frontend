import { Component, OnInit } from '@angular/core';
import {MyError} from '../../models/my-error';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {AppUser} from '../../models/app-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any = {};

  private error: any = {} ;
  private returnUrl = '/';
  private state: {};

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute)  {
   this.state = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.returnUrl = params.return );
    // this.router.getCurrentNavigation().extras.state?.products;
  }

  onSubmit() {
    // this.errors = [];
    this.authService.login(this.user).subscribe(
      (user) => {
        this.state ? this.router.navigate([this.returnUrl], { state: {...this.state} }) :
        this.router.navigateByUrl(this.returnUrl);
      }, (err) => {
        this.error = err;
      }
    );
  }
  getError() {
     return this.error?.message;
  }

  createAccount() {
    this.router.navigate(['/register'], {
      queryParams: {
        return: this.returnUrl
      }, state: {...this.state}
    });
  }
}
