import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { emailValidator } from '../../shared/validators/email-validator';
import { passwordGroupValidator } from '../../shared/validators/password-group-validator';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  readonly isLoading = signal<boolean>(false);

  registerForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, emailValidator()]],
    pass: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        rePassword: ['' , [Validators.required]] },
        {validators: [passwordGroupValidator('password', 'rePassword')] }
    ),
  });
  
  get controls() {
    return this.registerForm.controls;
  }
  get passControls() {
    return this.registerForm.controls.pass.controls;
  }

  registerHandler() {
    if (this.registerForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    const registerData = this.registerForm.getRawValue();
    const firstName = registerData.firstName;
    const lastName = registerData.lastName;
    const email = registerData.email;
    const password = registerData.pass.password;
    const rePassword = registerData.pass.rePassword;

    this.userService
      .register(firstName, lastName, email, password, rePassword)
      .subscribe({
        next: () => {
          this.toastService.activate(`Successfully registred with email: ${email}`);
          this.router.navigate(['/auth/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.toastService.activate(error.error.message || 'Registration failed!');
          this.registerForm.reset();
        },
      });
  }
}
