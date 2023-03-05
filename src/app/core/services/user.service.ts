import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AppUser} from '../models/app-user';
import {environment} from "../../../environments/environment.prod";
import {UserProfile} from "../models/userProfile";
import {SocialUserLogin} from "../models/socialUserLogin";


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

    googleLogin(socialUserLogin: SocialUserLogin) {
        return this.httpClient.post<AuthData>(this.baseUrl + 'auth/login/google', socialUserLogin);
    }

    facebookLogin(socialUserLogin: SocialUserLogin) {
        return this.httpClient.post<AuthData>(this.baseUrl + 'auth/login/facebook', socialUserLogin);
    }

    refreshMyToken(refreshToken: string) {
        return this.httpClient.post<AuthData>(this.baseUrl + 'auth/refresh-token', refreshToken);

    }

    sendActivationMessage(email: string) {
        return this.httpClient.patch<void>(this.baseUrl + 'auth/user/send-confirmation', email);
    }

    getCurrentAuthUser() {
        return this.httpClient.get<AppUser>(this.baseUrl + 'auth/user');
    }


    updateUserProfile(profile: UserProfile, id?: number) {
        return this.httpClient.patch<AppUser>(this.baseUrl + 'users/current', profile);
    }

    updateUserPassword(changePassword: ChangePassword) {
        return this.httpClient.patch(this.baseUrl + 'auth/user/change-password', changePassword);
    }


    updateImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);
        return this.httpClient.patch<any>(this.baseUrl + 'users/current/upload-image', formData);

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


