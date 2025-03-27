import { inject, Injectable, ɵflushModuleScopingQueueAsMuchAsPossible } from '@angular/core';
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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    const token = this.userService.getToken();

    if (this.userService.isLoggedIn && !this.userService.isTokenExpired(token!)) {
      return true;
      
    } else {
      this.toastService.activate('You have to be logged in to access this page');
      const returnUrl = route.url.map((u) => u.path).join('/');
      return this.router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl },
      });
    }
    
    // `return this.router.createUrlTree(['/auth/login'], { queryParams: { returnUrl } });` 
    // creates a URL tree that points to the login page (`'/auth/login'`) 
    // and includes a query parameter (`returnUrl`) with the URL of the originally requested route. 
    // This allows the application to redirect unauthenticated users to the login page 
    // and then back to their intended destination after they log in.
  }
}
