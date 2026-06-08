import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly currentToast = signal<ToastMessage | null>(null);
  private timeoutId: any = null;

  activate(message: any = 'Internal Server Error', title: string = '') {

    if(this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }

    this.currentToast.set({ message, title });

    this.timeoutId = window.setTimeout(() => {
      this.currentToast.set(null);
      this.timeoutId = null;
    }, 3000);
  }
}
