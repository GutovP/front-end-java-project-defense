import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { ToastService } from '../../core/toast/toast.service';

export const AdminActivate: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const token = userService.getToken();
  const userRole = userService.getUserRole();

  if (userService.isLoggedIn() && !userService.isTokenExpired(token!) && userRole === 'ADMIN') {

      return true;

    } else {

      toastService.activate('Only administrators can access this page.');
      return router.createUrlTree(['/auth/login']);

    }
  
}
