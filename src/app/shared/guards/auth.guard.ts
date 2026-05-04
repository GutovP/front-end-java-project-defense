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
export class AuthActivate implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {

    const token = this.userService.getToken();

    if (this.userService.isLoggedIn() && !this.userService.isTokenExpired(token!)) {
      return true;
      
    } else {

      this.toastService.activate('You have to be logged in to access this page');
      return this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url },});
    }
    
  }
}
