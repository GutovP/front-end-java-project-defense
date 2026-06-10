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
  readonly isLoading = signal<boolean>(false); // boolean kleingeschrieben

  // Formular startet standardmäßig OHNE Passwort-Validatoren auf Gruppenebene
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
    if (this.isLoading()) {
      return;
    }

    const token = this.userService.getToken();

    // Session-Prüfung
    if (!this.userService.isLoggedIn() && this.userService.isTokenExpired(token!)) {
      this.handleUnauthorized();
      return;
    }

    const profileValues = this.profileForm.getRawValue();

    // ==========================================
    // SEKTION 1: PASSWORT ÄNDERN
    // ==========================================
    if (field === 'password') {
      // Validatoren dynamisch aktivieren
      this.controls.currentPassword.setValidators([Validators.required]);
      this.controls.newPassword.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
      this.profileForm.setValidators([passwordGroupValidator('newPassword', 'confirmNewPassword')]);

      // Status aktualisieren
      this.controls.currentPassword.updateValueAndValidity();
      this.controls.newPassword.updateValueAndValidity();
      this.profileForm.updateValueAndValidity();

      // Validierung prüfen
      if (
        this.controls.currentPassword.invalid ||
        this.controls.newPassword.invalid ||
        this.profileForm.hasError('passwordGroupValidator')
      ) {
        this.controls.currentPassword.markAsTouched();
        this.controls.newPassword.markAsTouched();
        return;
      }

      this.isLoading.set(true);

      this.userService
        .changePassword(profileValues.currentPassword, profileValues.newPassword)
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.toggleEditMode(field);
            this.toastService.activate('Password updated successfully');

            // Validatoren und Formular nach Erfolg sauber zurücksetzen
            this.controls.currentPassword.clearValidators();
            this.controls.newPassword.clearValidators();
            this.profileForm.clearValidators();
            this.profileForm.reset();
            this.getUserProfile();
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading.set(false);
            if (error.status === 401) {
              this.handleUnauthorized();
            } else {
              this.toastService.activate(error.error.message || 'Error updating password');
            }
          },
        });

    // ==========================================
    // SEKTION 2: TEXTFELDER ÄNDERN (firstName, lastName, email)
    // ==========================================
    } else {
      const activeControl = this.profileForm.get(field);

      // Nur das geänderte Feld validieren, Passwörter werden ignoriert
      if (activeControl && activeControl.invalid) {
        activeControl.markAsTouched();
        return;
      }

      this.isLoading.set(true);

      this.userService
        .updateProfile(profileValues.firstName, profileValues.lastName, profileValues.email)
        .subscribe({
          next: (response: ProfileUpdateResponse) => {
            this.isLoading.set(false);

            // Lokales Sektion-Signal updaten
            this.user.set(response);
            
            // Formular-Werte synchron halten
            this.profileForm.patchValue({
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
            });

            this.toggleEditMode(field);
            this.toastService.activate('Profile updated successfully');
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading.set(false);
            // Wenn das Backend wegen des alten Tokens crasht (500) oder abweist (401)
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
