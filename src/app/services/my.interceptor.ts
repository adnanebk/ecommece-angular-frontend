import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class MyInterceptor implements HttpInterceptor {

  constructor(private toastrService: ToastrService) {
  }

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
    } else {
      return next.handle(request).pipe(
        catchError((resp) => {
          return this.handleError(resp);
        })
      );
    }
  }

  private handleError(resp) {
    if (!(resp.error instanceof ErrorEvent)) {
      {
        console.log(resp);
        if (resp.status === 400) {
          if (resp.error.errors) {
            return throwError(resp.error.errors);
          } else {
            this.toastrService.error(resp.error.message ? resp.error.message : resp.error, 'Error', {
              timeOut: 3000,
            });
            return throwError(resp.error);
          }
        } else if (resp.status === 403) {
          this.toastrService.error(resp?.error?.message, 'Error', {
            timeOut: 3000,
          });
          return throwError(resp?.error?.message);
        }
      }
    }
  }
}
