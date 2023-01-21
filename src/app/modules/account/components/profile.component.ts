import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private titleService: Title,private authService : AuthService) { }

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - Profile');
  }

    isSocialUser() {
        return this.authService.isSocialUser();
    }
}
