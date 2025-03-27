import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  loginHandler() {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;

    this.userService.login(email!, password!).subscribe({
      next: (user) => {
        this.toastService.activate(
          `Successfully logged in with email: ${user.user.email}`
        );
        this.router.navigate(['/auth/profile']);
      },
      error: (error: HttpErrorResponse) => {
        
        this.toastService.activate(error.error.message);
        this.loginForm.reset();
      },
    });
  }
}
