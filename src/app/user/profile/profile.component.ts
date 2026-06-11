import { Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { emailValidator } from '../../shared/validators/email-validator';
import { ProfileDetails, ProfileUpdateResponse } from '../../core/models/user';
import { passwordGroupValidator } from '../../shared/validators/password-group-validator';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  showEditMode: { [key: string]: boolean } = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  };

  readonly user = signal<ProfileDetails>({ firstName: '', lastName: '', email: '' });

  readonly profileForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, emailValidator()]],
    currentPassword: [''],
    newPassword: [''],
    confirmNewPassword: [''],
  });

  ngOnInit(): void {
    this.getUserProfile();
  }

  get controls() {
    return this.profileForm.controls;
  }

  getUserProfile() {
    return this.userService.getProfile().subscribe({
      next: (data) => {
        this.user.set(data);
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.handleUnauthorized();
        }
      },
    });
  }

  updateField(field: string): void {
    
    if (this.profileForm.invalid) {
      return;
    }

    const token = this.userService.getToken();

    if (!this.userService.isLoggedIn() && this.userService.isTokenExpired(token!)) {
      this.handleUnauthorized();
      return;
    }

    const profileValues = this.profileForm.getRawValue();

    if (field === 'password') {
      
      this.controls.currentPassword.setValidators([Validators.required]);
      this.controls.newPassword.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
      this.profileForm.setValidators([passwordGroupValidator('newPassword', 'confirmNewPassword')]);

      this.controls.currentPassword.updateValueAndValidity();
      this.controls.newPassword.updateValueAndValidity();
      this.profileForm.updateValueAndValidity();

      if (
        this.controls.currentPassword.invalid ||
        this.controls.newPassword.invalid ||
        this.profileForm.hasError('passwordGroupValidator')
      ) {
        this.controls.currentPassword.markAsTouched();
        this.controls.newPassword.markAsTouched();
        return;
      }

      this.userService
        .changePassword(profileValues.currentPassword, profileValues.newPassword)
        .subscribe({
          next: () => {
            this.toggleEditMode(field);
            this.toastService.activate('Password updated successfully');

            this.controls.currentPassword.clearValidators();
            this.controls.newPassword.clearValidators();
            this.profileForm.clearValidators();
            this.profileForm.reset();
            this.getUserProfile();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.handleUnauthorized();
            } else {
              this.toastService.activate(error.error.message || 'Error updating password');
            }
          },
        });

    } else {

      const activeControl = this.profileForm.get(field);

      if (activeControl && activeControl.invalid) {
        activeControl.markAsTouched();
        return;
      }

      this.userService
        .updateProfile(profileValues.firstName, profileValues.lastName, profileValues.email)
        .subscribe({
          next: (response: ProfileUpdateResponse) => {

            this.user.set(response);
            
            this.profileForm.patchValue({
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
            });

            this.toggleEditMode(field);
            this.toastService.activate('Profile updated successfully');
          },
          error: (error: HttpErrorResponse) => {

            if (error.status === 401 || error.status === 500) {
              this.handleUnauthorized();
            } else {
              this.toastService.activate(error.error.message || 'Error updating profile');
            }
          },
        });
    }
  }

  handleUnauthorized(): void {
    this.userService.logout();
    this.toastService.activate('Your session has expired. Please login again.');
    this.router.navigate(['/auth/login']);
  }

  toggleEditMode(field: string): void {
    this.showEditMode[field] = !this.showEditMode[field];
  }
}
