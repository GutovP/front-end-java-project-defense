import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../user/user.service';

export const NoAdminGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
        const router = inject(Router);

        if (userService.getUserRole() === 'ADMIN') {
          router.createUrlTree(['/products/all']);
          return false;
        }
        return true;
};
