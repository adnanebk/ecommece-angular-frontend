import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from './services/http.service';
import {AppUser} from './models/app-user';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ecommece-app';
  user: AppUser;
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();

  }

  getUser(): any {
     /* if (this.user)
      {
        return this.user;
      }*/
      this.user = this.authService.getUser();
      return this.user;
  }
  logout() {
    // this.user = null;
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
