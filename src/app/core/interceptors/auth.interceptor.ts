import {catchError, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {HttpErrorHandlerService} from "../services/http-error-handler.service";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private errorHandlerService: HttpErrorHandlerService,private authService:AuthService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();
        let  cloned = request;
        if (token) {
             cloned = AuthInterceptor.createRequestWithToken(request,token);
        }
            return next.handle(cloned).pipe(
                catchError((resp) => {
                    return this.errorHandlerService.handleError(resp,cloned,next);
                })
            );
        }
        static createRequestWithToken(request: HttpRequest<unknown>,token: string){
           return request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + token)
            });
        }
    }