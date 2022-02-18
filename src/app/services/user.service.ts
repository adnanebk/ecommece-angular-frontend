import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ProductCategory} from '../models/product-category';
import {AppUser} from '../models/app-user';
import {environment} from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class userService {
  private baseUrl = environment.path;


  constructor(private httpClient: HttpClient) {
  }



  register(user: any) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'register', user);
  }

  login(user: any) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'login', user);
  }

  googleLogin(data: { appUser: AppUser, token: string }) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'google', data);
  }

  facebook(data: { appUser: AppUser, token: string }) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'facebook', data);
  }
  refreshMyToken(refreshToken: string) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'refresh-token', refreshToken);

  }
  getUserInfo(userName: string) {
    return this.httpClient.get<AppUser>(this.baseUrl + 'appUsers/search/byUserName?userName='+userName);
  }

  updateUser(user: AppUser, id: number) {
    return this.httpClient.patch<AppUser>(this.baseUrl+'appUsers/'+id, user);

  }
  updateUserPassword(userPasswords: any) {
    return this.httpClient.post(this.baseUrl+'appUsers/change-password', userPasswords);
  }
  sendActivationMessage(email: string) {
    return this.httpClient.post<void>(this.baseUrl + 'confirm', email);
  }



}



interface AuthData {
  appUser: AppUser;
  token: string;
  refreshToken: string;
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}

