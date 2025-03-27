import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../../user/user.service';
import { ToastService } from '../../core/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AdminActivate implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    const token = this.userService.getToken();
    const userRole = this.userService.getUserRole();

    if (
      this.userService.isLoggedIn &&
      !this.userService.isTokenExpired(token!) &&
      userRole === 'ADMIN'
    ) {
      return true;
    } else {
      this.toastService.activate('Only administrators can access this page.');
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
