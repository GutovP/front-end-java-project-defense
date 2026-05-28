import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { ToastService } from '../../core/toast/toast.service';


export const AuthActivate: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const token = userService.getToken();

  if (userService.isLoggedIn() && !userService.isTokenExpired(token!)) {
      return true;
      
    }

    toastService.activate('You have to be logged in to access this page');
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url },}); 
  
}
