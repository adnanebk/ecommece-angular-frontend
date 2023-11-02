import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {AuthInterceptor} from "../interceptors/auth.interceptor";
import {ApiError} from "../models/api-error";

@Injectable({
    providedIn: 'root'
})
export class HttpErrorHandlerService {
    constructor(public authService: AuthService) {
    }


    handleError(resp: { error: ApiError; status: number }, originalRequest: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const {error, status} = resp;
        if (!(error instanceof ErrorEvent)) {
            {
                if (status === 401 && error?.code === 'jwt.expired') {
                    if (this.authService.isTokenExpired)
                        return this.handleError(resp, originalRequest, next);
                    return this.authService.refreshJwtToken().pipe(
                        switchMap((authData) => next.handle(AuthInterceptor.createRequestWithToken(originalRequest, authData.token))),
                        catchError((err) => this.handleError(err, originalRequest, next)),
                    );
                }
                else if (status === 403 && error?.code === 'user.not.enabled')
                    this.authService.sendCompleteRegistrationNotification();
            }
        }
        return throwError(()=>error);
    }
}
