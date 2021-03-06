import {Component, OnInit} from '@angular/core';
import {AppUser} from './models/app-user';
import {AuthService} from './services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ecommece-app';
  user: AppUser;

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.authService.userSubject.subscribe((user) => {
      this.user = user;
      this.activatedRoute.queryParamMap.subscribe(async param => {
        if (param.get('verified')) {
          let user: AppUser = await this.authService.getUserInfo();
          if (user.enabled) {
            this.authService.sendConfirmedWithSuccess();
          }
        }
      });
    });

  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  getDocs() {
    return environment.pathDoc;
  }

}
