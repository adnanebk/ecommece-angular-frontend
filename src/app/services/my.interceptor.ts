import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class MyInterceptor implements HttpInterceptor {

  constructor() {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = localStorage.getItem('token');
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(cloned).pipe(
        catchError((resp) => {
          return this.handleError(resp);
        })
      );
    }
    else {
      return next.handle(request).pipe(
        catchError((resp) => {
          return this.handleError(resp);
        })
      );
    }
  }

  private handleError(resp) {
    console.log('error is intercept');
    console.log(resp);
    if (!(resp.error instanceof ErrorEvent)) {
      {
        console.log(resp);
        if (resp.status === 400) {
          return resp.error.errors ? throwError(resp.error.errors ) : throwError(resp.error);
        } else if (resp.status === 403) {
          return throwError(resp?.error?.message);
        }
      }
    }
  }
}
