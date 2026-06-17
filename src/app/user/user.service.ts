import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {catchError, Observable,tap, throwError} from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment.development';
import { ProfileUpdateResponse, User } from '../core/models/user';

const baseUrl = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private user = signal<User | null>(null);
  readonly currentUser = this.user.asReadonly();
  readonly isLoggedIn = computed(() => !!this.user());
  readonly getUserRole = computed(() => this.user()?.role || '');

  constructor() {

    const storedToken = this.getToken();

    if (!storedToken || this.isTokenExpired(storedToken)) {
      this.logout();

    } else {

      const setUser = localStorage.getItem('user');

      if (setUser) {
        this.user.set(JSON.parse(setUser));

      } else {
        this.getProfile().subscribe();
      }
    }

  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(token: string): boolean {
      if (!token) {
      return true;
    }
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = decodeURIComponent(
        atob(payloadBase64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const expiry = JSON.parse(decodedPayload).exp;
      return Math.floor(Date.now() / 1000) >= expiry;

    } catch (e) {
      return true; 
    }
  }

  checkTokenValidity(): void {
    const token = this.getToken();

    if (token && this.isTokenExpired(token)) {
      this.logout();
    }
  }

  setUser(user: User): void {
      this.user.set(user);
      localStorage.setItem('user', JSON.stringify(user));
  }

  register(firstName: string, lastName: string, email: string, password: string, rePassword: string): Observable<User> {
    return this.http.post<User>(`${baseUrl}/auth/register`, { firstName, lastName, email, password, rePassword }, { withCredentials: true })
      .pipe(
        tap((user) => {
          this.setUser(user);
        }),
        catchError(this.errorHandler)
      );
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${baseUrl}/auth/login`,{ email, password },{ withCredentials: true })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.setUser(response.user);
        }),
        catchError(this.errorHandler)
      );
  }
  logout(): void {
    this.user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }
  getProfile(): Observable<User> {
    return this.http.get<User>(`${baseUrl}/user/profile`, { withCredentials: true })
      .pipe(
        tap((user) => {
          this.setUser(user);
        }),
        catchError(this.errorHandler)
      );
  }

  updateProfile(firstName: string, lastName: string, email: string): Observable<ProfileUpdateResponse> {

    const updatePayload: Partial<User> = { firstName, lastName, email };

    return this.http.put<ProfileUpdateResponse>(`${baseUrl}/user/profile`, updatePayload, {withCredentials: true,})
      .pipe(
        tap((response) => {

          if (response.token) {

            localStorage.setItem('token', response.token)
          }

          const updatedUser: User = {
            ...this.user(),
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email
          } as User

          this.setUser(updatedUser);
        }),
        catchError(this.errorHandler)
      );
  }
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    
    return this.http.put(`${baseUrl}/user/change-password`, { currentPassword, newPassword }, { withCredentials: true })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.error?.message || error.message || 'Server Error'));
  }

}