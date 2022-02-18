import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpErrorHandlerService} from "./http-error-handler.service";

@Injectable()
export class MyInterceptor implements HttpInterceptor {

  constructor(private errorHandlerService: HttpErrorHandlerService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(cloned).pipe(
        catchError((resp) => {
          return this.errorHandlerService.handleError(resp);
        })
      );
    } else {
      return next.handle(request).pipe(
        catchError((resp) => {
          return this.errorHandlerService.handleError(resp);
        })
      );
    }
  }

}
