import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { emailValidator } from '../../shared/validators/email-validator';
import { CommonModule } from '@angular/common';
import { ProfileDetails, User } from '../../core/models/user';
import { passwordGroupValidator } from '../../shared/validators/password-group-validator';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private formbuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  showEditMode: { [key: string]: boolean } = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  };

  user: ProfileDetails = { firstName: '', lastName: '', email: '' };

  profileForm = this.formbuilder.group(
    {
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, emailValidator()]],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.minLength(6), Validators.maxLength(20)]],
      confirmNewPassword: [''],
    },
    {
      validators: [passwordGroupValidator('newPassword', 'confirmNewPassword')],
    }
  );

  ngOnInit(): void {
    this.getUserProfile();
  }

  get firstname() {
    return this.profileForm.get('firstName');
  }

  get lastname() {
    return this.profileForm.get('lastName');
  }

  get email() {
    return this.profileForm.get('email');
  }
  get currentPassword() {
    return this.profileForm.get('currentPassword');
  }
  get newPassword() {
    return this.profileForm.get('newPassword');
  }
  get confirmNewPassword() {
    return this.profileForm.get('confirmNewPassword');
  }

  getUserProfile() {
    return this.userService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.userService.logout();
          this.toastService.activate('Please login to view your profile');
          this.router.navigate(['/auth/login']);
        }
      },
    });
  }

  updateField(field: string): void {
    const token = this.userService.getToken();

    if (!this.userService.isLoggedIn && this.userService.isTokenExpired(token!)) {
      this.handleUnauthorized();
      return;
    }

    if (field === 'password') {
      this.profileForm.get('currentPassword')?.setValidators([Validators.required]);
      this.profileForm.get('currentPassword')?.updateValueAndValidity();
      
    } else {
      this.profileForm.get('currentPassword')?.clearValidators();
      this.profileForm.get('currentPassword')?.updateValueAndValidity();
    }

    if (this.profileForm.invalid) {
      return;
    }

    if (field === 'password') {
      const currentPassword = this.currentPassword?.value;
      const newPassword = this.newPassword?.value;

      this.userService
        .changePassword(currentPassword!, newPassword!)
        .subscribe({
          next: () => {
            this.toggleEditMode(field);
            this.toastService.activate('Password updated successfully');
            this.getUserProfile();
            this.profileForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.handleUnauthorized();
            } else {
              this.toastService.activate(error.error.message);
            }
          },
        });
    } else {
      const updatedFields: Partial<User> = {
        firstName: this.firstname?.value ?? '',
        lastName: this.lastname?.value ?? '',
        email: this.email?.value ?? '',
      };

      this.userService
        .updateProfile(updatedFields.firstName!, updatedFields.lastName!, updatedFields.email!)
        .subscribe({
          next: (user) => {
            this.user = user;
            this.profileForm.patchValue({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            });
            this.toggleEditMode(field);
            this.toastService.activate('Profile updated successfully');
            this.getUserProfile();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.handleUnauthorized();
            } else {
              this.toastService.activate(error.error.message);
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
