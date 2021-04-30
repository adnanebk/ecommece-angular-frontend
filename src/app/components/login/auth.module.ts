import { NgModule } from '@angular/core';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {environment} from '../../../environments/environment.prod';


@NgModule({
  imports: [
    SocialLoginModule
  ],
  providers: [
    {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider(environment.facebook.clientId)
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(environment.google.clientId)
        }
      ]
    } as SocialAuthServiceConfig,
  }]
})
export class AuthModule { }
