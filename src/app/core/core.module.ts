import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [],
  imports: [HeaderComponent, ToastComponent],
  exports: [HeaderComponent, ToastComponent],
})
export class CoreModule {}
