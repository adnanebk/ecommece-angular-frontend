import { Injectable } from '@angular/core';
import {AppUser} from '../models/app-user';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private baseUrl = 'https://adnanbk-shopp.herokuapp.com/api/';
  // private baseUrl = 'http://localhost:8080/api/';
   public userSubject = new BehaviorSubject<AppUser>(null);
  constructor(private httpClient: HttpClient) { }

  register(user: any) {
    return this.httpClient.post<{ token: string, appUser: AppUser }>(this.baseUrl + 'register', user ).pipe(
      map(response => {
        localStorage.setItem('appUser', JSON.stringify(response.appUser));
        localStorage.setItem('token', response.token);
        this.userSubject.next(response.appUser);
        return response.appUser;
      })
    );
  }
  login(user: any) {
    return this.httpClient.post<{ token: string, appUser: AppUser }>(this.baseUrl + 'login', user).pipe(
      map(response => {
        localStorage.setItem('appUser', JSON.stringify(response.appUser));
        localStorage.setItem('token', response.token);
        this.userSubject.next(response.appUser);
        return response.appUser;
      })
    );
  }
  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('appUser');
    localStorage.removeItem('token');
  }

}
