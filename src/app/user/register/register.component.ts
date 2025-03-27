import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { emailValidator } from '../../shared/validators/email-validator';
import { passwordGroupValidator } from '../../shared/validators/password-group-validator';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  registerForm = this.formBuilder.group({
    firstName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    email: ['', [Validators.required, emailValidator()]],
    pass: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        rePassword: [''] }, 
        {   validators: [passwordGroupValidator('password', 'rePassword')] }
    ),
  });
  get firstname() {
    return this.registerForm.get('firstName');
  }
  get lastname() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('pass.password');
  }
  get rePassword() {
    return this.registerForm.get('pass');
  }

  registerHandler() {
    if (this.registerForm.invalid) {
      return;
    }

    const {
      firstName,
      lastName,
      email,
      pass: { password, rePassword } = {},
    } = this.registerForm.value;

    this.userService
      .register(firstName!, lastName!, email!, password!, rePassword!)
      .subscribe({
        next: () => {
          this.toastService.activate(
            `successfully registred with email: ${email}`
          );
          this.router.navigate(['/auth/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.activate(error.error.message);
          this.registerForm.reset();
        },
      });
  }
}
