import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AppUser} from '../models/app-user';
import {environment} from "../../../environments/environment.prod";
import {UserProfile} from "../models/userProfile";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.path;


  constructor(private httpClient: HttpClient) {
  }

  register(user: any) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'auth/register', user);
  }

  login(user: any) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'auth/login', user);
  }

  googleLogin(data: { appUser: AppUser, token: string }) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'auth/login/google', data);
  }

  facebookLogin(data: { appUser: AppUser, token: string }) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'auth/login/facebook', data);
  }

  refreshMyToken(refreshToken: string) {
    return this.httpClient.post<AuthData>(this.baseUrl + 'auth/refresh-token', refreshToken);

  }

  getByEmail(email: string) {
    return this.httpClient.get<AppUser>(this.baseUrl + 'user/email/' + email);
  }

  updateUserProfile(profile: UserProfile, id: number) {
    return this.httpClient.patch<AppUser>(this.baseUrl + 'users/' + id, profile);
  }

  updateUserPassword(changePassword:ChangePassword) {
    return this.httpClient.post(this.baseUrl + 'user/change-password', changePassword);
  }

  sendActivationMessage(email: string) {
    return this.httpClient.patch<void>(this.baseUrl + 'user/confirm', email);
  }

    updateImage(file: File) {
      const formData = new FormData();
      formData.append('image', file);
      return this.httpClient.patch<any>(this.baseUrl + 'user/upload-image',formData);

    }

}


export interface AuthData {
  appUser: AppUser;
  token: string;
  refreshToken: string;
  expirationDate: Date;
}
interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}


