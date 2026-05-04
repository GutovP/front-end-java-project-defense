import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {catchError, Observable,tap, throwError} from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment.development';
import { User } from '../core/models/user';

const baseUrl = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private user = signal<User | undefined>(undefined);
  get currentUser() {
    return this.user();
  }
  isLoggedIn = computed(() => !!this.user());

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.storeUser(JSON.parse(storedUser));
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken && !storedUser) {
      this.getProfile().subscribe();
    }

    // using effect to react to user changes
    effect(() => {

      const currentUser = this.user();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));

      } else {
        localStorage.removeItem('user');
      }
    });
  }
  getToken() {
    return localStorage.getItem('token');
  }

  isTokenExpired(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  getUserRole() {
    return this.user()?.['role'] || '';
  }
  storeUser(user: User): void {
      this.user.set(user);
  }

  register(firstName: string, lastName: string, email: string, password: string, rePassword: string): Observable<User> {
    return this.http.post<User>(`${baseUrl}/auth/register`, { firstName, lastName, email, password, rePassword }, { withCredentials: true })
      .pipe(
        tap((user) => {
          this.storeUser(user);
        }),
        catchError(this.errorHandler)
      );
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${baseUrl}/auth/login`,{ email, password },{ withCredentials: true })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.storeUser(response.user);
        }),
        catchError(this.errorHandler)
      );
  }
  logout(): void {
    this.user.set(undefined);
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
  getProfile(): Observable<User> {
    return this.http.get<User>(`${baseUrl}/user/profile`, { withCredentials: true })
      .pipe(
        tap((user) => {
          this.storeUser(user);
        }),
        catchError(this.errorHandler)
      );
  }

  updateProfile(firstName: string, lastName: string, email: string): Observable<User> {
    const updatePayload: Partial<User> = { firstName, lastName, email };
    return this.http.put<User>(`${baseUrl}/user/profile`, updatePayload, {withCredentials: true,})
      .pipe(
        tap((user) => {
          this.storeUser(user);
        }),
        catchError(this.errorHandler)
      );
  }
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    
    return this.http.put(`${baseUrl}/user/change-password`, { currentPassword, newPassword }, { withCredentials: true })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message));
  }

}
