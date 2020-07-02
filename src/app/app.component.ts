import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from './services/http.service';
import {AppUser} from './models/app-user';
import {AuthService} from './services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ecommece-app';
  user: AppUser;
  constructor(private authService: AuthService, private router: Router){
  }

  ngOnInit(): void {
    this.authService.userSubject.subscribe((user) => {
      this.user = user;
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
