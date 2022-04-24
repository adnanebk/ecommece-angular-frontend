import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {switchMap, throwError} from "rxjs";
import {HttpHandler, HttpRequest} from "@angular/common/http";
import {AuthInterceptor} from "../interceptors/auth.interceptor";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {
  constructor(public authService: AuthService) {
  }


  handleError(resp: { error: { errors: any; message: string | undefined; code: string }; status: number }, originalRequest: HttpRequest<unknown>, next: HttpHandler) {
    if (!(resp.error instanceof ErrorEvent)) {
      {
        if (resp.status >= 400 && resp.status < 500) {
          if (resp?.error?.errors) {
            if(resp.status===401 && resp.error.code==='jwt.expired')
               {
                if(this.authService.isTokenExpired)
                  this.authService.logout();
                  else
                return this.authService.refreshJwtToken().pipe(
                    switchMap((resp) => next.handle(AuthInterceptor.createRequestWithToken(originalRequest, resp.token))),
                     );
              }
            else if(resp.status===403 && resp.error.code==='user.not.enabled')
              this.authService.sendCompleteRegistrationNotification();

            return throwError(resp.error.errors?.length ? resp.error.errors : [resp.error]);
          }
        }
      }
    }
    // this.authService.refreshJwtToken();
      return throwError([resp.error]);
  }
}
