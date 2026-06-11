import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ToastComponent } from './toast/toast.component';
import { LoadingSpinnerComponent } from './global-loader/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [],
  imports: [HeaderComponent, ToastComponent, LoadingSpinnerComponent],
  exports: [HeaderComponent, ToastComponent, LoadingSpinnerComponent],
})
export class CoreModule {}
