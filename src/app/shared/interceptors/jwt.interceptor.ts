import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { UserService } from "../../user/user.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const token = userService.getToken();

  const newReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        userService.logout();
        if (router.url !== '/auth/login') {
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
