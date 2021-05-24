import {Observable, Subject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private subject = new Subject<any>();

  confirmThis(yesFn: () => void, noFn: () => void = () => {
  }): any {
    this.setConfirmation(yesFn, noFn);
  }

  setConfirmation(yesFn: () => void, noFn: () => void): any {
    const that = this;
    this.subject.next({
      type: 'confirm',
      yesFn(): any {
        that.subject.next(); // This will close the modal
        yesFn();
      },
      noFn(): any {
        that.subject.next();
        noFn();
      }
    });

  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
