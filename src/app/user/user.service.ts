import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subscription,
  tap,
  throwError,
} from 'rxjs';

import { User } from '../core/models/user';
import { Router } from '@angular/router';

const baseUrl = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);

  private user$$ = new BehaviorSubject<User | undefined>(undefined);
  private user$ = this.user$$.asObservable();
  user: User | undefined;
  subscription: Subscription;

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user$$.next(JSON.parse(storedUser));
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.getProfile().subscribe();
    }

    this.subscription = this.user$.subscribe((user) => {
      this.user = user;
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
    return this.user?.['role'] || '';
  }
  validateToken(options: {headers: HttpHeaders; responseType: 'text';}): Observable<any> {
    return this.http.get(`${baseUrl}/user/validate-token`, {headers: options.headers,responseType: 'text',});
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    rePassword: string
  ): Observable<User> {
    return this.http
      .post<User>(
        `${baseUrl}/auth/register`,
        { firstName, lastName, email, password, rePassword },
        { withCredentials: true }
      )
      .pipe(
        catchError(this.errorHandler),
        tap((user) => {
          this.user$$.next(user);
        })
      );
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {

    return this.http.post<{ token: string; user: User }>(`${baseUrl}/auth/login`,{ email, password },{ withCredentials: true })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.user$$.next(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        }),
        catchError(this.errorHandler)
      );
  }
  logout(): void {
    this.user$$.next(undefined);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
  getProfile(): Observable<User> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<User>(`${baseUrl}/user/profile`, { headers, withCredentials: true })
      .pipe(
        tap((user) => {
          this.user$$.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        }),
        catchError(this.errorHandler)
      );
  }

  updateProfile(
    firstName: string,
    lastName: string,
    email: string
  ): Observable<User> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const updatePayload: Partial<User> = { firstName, lastName, email };

    return this.http
      .put<User>(`${baseUrl}/user/profile`, updatePayload, {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this.user$$.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        }),
        catchError(this.errorHandler)
      );
  }
  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .put(
        `${baseUrl}/user/change-password`,
        { currentPassword, newPassword },
        { headers, withCredentials: true }
      )
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
