import { Injectable } from '@angular/core';
import {AppUser} from '../models/app-user';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private baseUrl = 'https://adnanbk-shopp.herokuapp.com/api/';
   private baseUrl = 'http://localhost:8080/api/';
  private user: AppUser;
  constructor(private httpClient: HttpClient) { }


  login(user: any) {
    return this.httpClient.post<{ token: string, appUser: AppUser }>(this.baseUrl + 'login', user).pipe(
      map(response => {
        localStorage.setItem('appUser', JSON.stringify(response.appUser));
        localStorage.setItem('token', response.token);
        return response.appUser;
      })
    );
  }
  logout() {
    localStorage.removeItem('appUser');
    localStorage.removeItem('token');
  }

  public isLoggedIn() {
    return (localStorage.getItem('appUser') && localStorage.getItem('appUser').length > 0 );
  }
  getUser(): AppUser
  {
    if (this.user)
    {
      return this.user;
    }
    this.user = JSON.parse(localStorage.getItem('appUser'));
    return this.user;
  }
}
