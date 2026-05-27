import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';

import { ToastService } from '../../core/toast/toast.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { emailValidator } from '../../shared/validators/email-validator';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, emailValidator()]],
    password: ['', Validators.required],
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  
  loginHandler() {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;

    this.userService.login(email!, password!).subscribe({
      next: (user) => {
        this.toastService.activate(`Welcome, ${user.user.firstName}! You are now logged in.`);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.activate(error.error.message);
        this.loginForm.reset();
      },
    });
  }
}
