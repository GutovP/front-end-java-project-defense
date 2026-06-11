import { Component, computed, effect, inject, signal } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  private loadingService = inject(LoadingService);

  private isDelayed = signal<boolean>(false);
  private timeoutId: any;
  readonly shouldShow = computed(() => this.loadingService.isLoading() && this.isDelayed());

  constructor () {

    effect(() => {
      if (this.loadingService.isLoading()) {
        this.timeoutId = setTimeout(() => this.isDelayed.set(true), 250);

      } else {
        clearTimeout(this.timeoutId);
        this.isDelayed.set(false);
      }
    })
  }
}
