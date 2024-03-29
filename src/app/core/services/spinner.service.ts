import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    visibility = new BehaviorSubject(false);
    

    show() {
        setTimeout(()=>
         this.visibility.next(true));
    }

    hide() {
        setTimeout(()=>
            this.visibility.next(false));
    }
}
