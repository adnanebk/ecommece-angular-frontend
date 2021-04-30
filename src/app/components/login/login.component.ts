import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any = {};

  private error: any = {};
  private returnUrl = '/';
  private state: {};

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.state = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>
               this.returnUrl = params.return);
    // this.router.getCurrentNavigation().extras.state?.products;
  }

  onLogin() {
    this.authService.login(this.user).subscribe(
      (user) => {
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

  createAccount() {
    this.router.navigate(['/register'], {
      queryParams: {
        return: this.returnUrl
      }, state: {...this.state}
    });
  }

 async googleLogin() {
  await this.authService.loginWithGoogle();
  await this.router.navigateByUrl('/');

 }

 async facebookLogin() {
    await this.authService.loginWithFacebook();
    await this.router.navigateByUrl('/');

 }
}
