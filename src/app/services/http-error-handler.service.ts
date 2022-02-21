import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {throwError} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor(private authService: AuthService, private toastrService: ToastrService) {
  }

  handleError(resp) {
    // let authService=this.injector.get(AuthService);
    if (!(resp.error instanceof ErrorEvent)) {
      {
        if (resp.status >= 400 && resp.status < 500) {
          this.authService.verifyTokenExpiration();

          if (resp.error.errors) {
            return throwError(resp.error.errors);
          } else if (resp.error?.message) {
            if (resp.status === 403){
              this.authService.verifyUser();
            } else {
              this.toastrService.error(resp.error.message, 'Error', {
                timeOut: 3000,
              });
            }
            return throwError(resp.error);
          }
        }
      }
    }
  }
}
