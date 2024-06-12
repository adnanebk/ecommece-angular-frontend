import {CacheService} from '../services/cache.service';
import {catchError, EMPTY, finalize, Observable, switchMap, tap, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {AuthService} from "../services/auth.service";
import { ApiError } from '../models/api-error';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
    isRefreshing = false;

    constructor( private authService: AuthService,private cacheService: CacheService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
       const token = this.authService.getToken();
        if(!this.isRefreshing)
         return this.cacheService.applyCache(request,this.handleRequest(token,next,request));
        return this.handleRequest(token,next,request)
    }

    handleError(resp: { error: ApiError; status: number }, originalRequest: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const {error, status} = resp;
        if (resp instanceof HttpErrorResponse)
            {
                if (this.canRefreshToken(status, error)) {
                    this.isRefreshing = true;
                    return this.authService.refreshJwtToken().pipe(
                        catchError((err) => {
                            this.isRefreshing=false;
                            this.authService.logout();
                            return EMPTY;
                        }),
                        switchMap((authData) => {
                            return this.handleRequest(authData.token,next,originalRequest)
                            .pipe(finalize(()=>this.isRefreshing=false));
                        })
                    );
                }
                else if (status === 403 && error?.code === 'user.not.enabled')
                    this.authService.sendCompleteRegistrationNotification();
        }
        return throwError(()=>error);
    }

    private canRefreshToken(status: number, error: ApiError) {
        return !this.isRefreshing && status === 401 && error?.code === 'jwt.expired' && this.authService.isUserAuthenticated();
    }

    private createRequestWithToken(request: HttpRequest<unknown>, token: string) {
        return request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + token)
        });
    }

    private handleRequest(token: string | undefined,next: HttpHandler,req: HttpRequest<unknown>){
        req = token ? this.createRequestWithToken(req, token):req;    
        return  next.handle(req).pipe(
            catchError((resp) => {
                return this.handleError(resp, req, next);
            })
        )
    }
}
