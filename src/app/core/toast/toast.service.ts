import {Injectable, Optional, SkipSelf} from '@angular/core';
import { Subject } from 'rxjs';
import { ToastMessage } from '../models/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toast$$ = new Subject<ToastMessage>();
  toast$ = this.toast$$.asObservable();

  constructor(@Optional() @SkipSelf() prior: ToastService) {
    if (prior) {
      console.log('toast service exists');
      return prior;
    } else {
      console.log('toast service created');
    }
  }

  activate(message?: any) {
    this.toast$$.next(<ToastMessage>{ message: message });
  }
}
