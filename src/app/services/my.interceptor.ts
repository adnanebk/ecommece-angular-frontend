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
    return next.handle(request).pipe(
      catchError((resp) => {
        console.log('error is intercept');
        if (!(resp.error instanceof ErrorEvent)) {
          {
            if (resp.status === 400)
            {
              return throwError(resp?.error?.errors);
            }
          }
        }
      })
    );
  }
}
