import {CacheService} from '../services/cache.service';
import {catchError, EMPTY, Observable, switchMap, throwError} from 'rxjs';
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
        let cloned = request;
        if (token) {
            cloned = this.createRequestWithToken(request, token);
        }
        if(!this.isRefreshing)
         return this.cacheService.applyCache(cloned,this.handleRequest(next,cloned));
        return this.handleRequest(next,cloned)
    }

    handleError(resp: { error: ApiError; status: number }, originalRequest: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const {error, status} = resp;
        if (resp instanceof HttpErrorResponse)
            {
                if (status === 401 && error?.code === 'jwt.expired' && this.authService.isUserAuthenticated()) {
                    this.isRefreshing = true;
                    return this.authService.refreshJwtToken().pipe(
                        catchError((err) => {
                            this.isRefreshing=false;
                            this.authService.logout();
                            return EMPTY;
                        }),
                        switchMap((authData) => {
                            this.isRefreshing=false;
                            return next.handle(this.createRequestWithToken(originalRequest, authData.token));
                        })
                    );
                }
                else if (status === 403 && error?.code === 'user.not.enabled')
                    this.authService.sendCompleteRegistrationNotification();
        }
        return throwError(()=>error);
    }

    private createRequestWithToken(request: HttpRequest<unknown>, token: string) {
        return request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + token)
        });
    }

    private handleRequest(next: HttpHandler,req: HttpRequest<unknown>){
        return  next.handle(req).pipe(
            catchError((resp) => {
                return this.handleError(resp, req, next);
            })
        )
    }
}
