import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private default = {
    title: '',
    message: 'Internal Server Error',
  };
  private toastElement: any;
  title: string | undefined;
  message: string | undefined;

  constructor(private toastService: ToastService) {
    this.subscription.add(
      this.toastService.toast$.subscribe((toastMessage) => {
        this.activate(toastMessage.message);
      })
    );
  }
  activate(message = this.default.message, title = this.default.title) {
    this.title = title;
    this.message = message;
    this.show();
  }

  ngOnInit(): void {
    this.toastElement = document.getElementById('toast');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private show() {
    this.toastElement.style.opacity = 1;
    this.toastElement.style.zIndex = 9999;

    window.setTimeout(() => this.hide(), 3000);
  }
  private hide() {
    this.toastElement.style.opacity = 0;

    window.setTimeout(() => (this.toastElement.style.zIndex = 0), 3000);
  }
}
