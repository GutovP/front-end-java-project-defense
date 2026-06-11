import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingState = signal<boolean>(false);

  readonly isLoading = this.loadingState.asReadonly();
  
  show(): void {
    this.loadingState.set(true);
  }
  hide(): void {
    this.loadingState.set(false);
  }
}
