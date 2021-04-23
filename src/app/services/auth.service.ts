import {Injectable} from '@angular/core';
import {AppUser} from '../models/app-user';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userSubject = new BehaviorSubject<AppUser>(null);

  constructor(private httpService: HttpService) {
    const currentUserSt = localStorage.getItem('appUser');
    if (currentUserSt?.length > 0) {
      const currentUser = JSON.parse(currentUserSt);
      this.userSubject.next(currentUser);
    }
  }

  register(user: any) {
    return this.httpService.register(user).pipe(
      map(response => {
        return this.returnConnectedUser(response);
      })
    );
  }


  login(user: any) {
    return this.httpService.login(user).pipe(
      map(response => {
        return this.returnConnectedUser(response);
      })
    );
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('appUser');
    localStorage.removeItem('token');
  }

  private returnConnectedUser(response: { token: string; appUser: AppUser }) {
    localStorage.setItem('appUser', JSON.stringify(response.appUser));
    localStorage.setItem('token', response.token);
    this.userSubject.next(response.appUser);
    return response.appUser;
  }
}
