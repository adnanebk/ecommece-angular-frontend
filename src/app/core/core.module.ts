import {ErrorHandler, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MediaMatcher} from '@angular/cdk/layout';
import {NGXLogger} from 'ngx-logger';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {SpinnerInterceptor} from './interceptors/spinner.interceptor';
import {AuthGuard} from './guards/auth.guard';
import {throwIfAlreadyLoaded} from './guards/module-import.guard';
import {
    FacebookLoginProvider,
    GoogleLoginProvider,
    SocialAuthServiceConfig,
    SocialLoginModule
} from "angularx-social-login";
import {environment} from "../../environments/environment.prod";
import {ToastrModule} from "ngx-toastr";
import {AdminAuthGuard} from "./guards/admin-auth.guard";

@NgModule({
    imports: [
        CommonModule,
        SocialLoginModule,
        HttpClientModule,
        ToastrModule.forRoot(),
    ],
    declarations: [],
    providers: [
        AuthGuard,
        AdminAuthGuard,

        MediaMatcher,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SpinnerInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: ErrorHandler
        },
        {provide: NGXLogger, useClass: NGXLogger},
        {provide: 'LOCALSTORAGE', useValue: window.localStorage},

        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            environment.google.clientId
                        )
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider(environment.facebook.clientId)
                    }
                ]
            } as SocialAuthServiceConfig,
        }

    ],

    exports: []
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
