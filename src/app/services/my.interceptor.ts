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
import {AuthService} from './auth.service';

@Injectable()
export class MyInterceptor implements HttpInterceptor {

  constructor(private toastrService: ToastrService,private authService: AuthService) {
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
        if (resp.status === 400 || resp.status === 403) {
          if (resp.error.errors) {
            return throwError(resp.error.errors);
          } else if(resp.error?.message){
            if(resp.status===403)
              this.authService.verifyUser();
            else
            this.toastrService.error(resp.error.message, 'Error', {
              timeOut: 3000,
            });
            return throwError(resp.error);
          }
        } else if (resp.status.startsWith('4')) {
          this.toastrService.error(resp?.error?.message, 'Error', {
            timeOut: 3000,
          });
          return throwError(resp?.error?.message);
        }
      }
    }
  }
}
