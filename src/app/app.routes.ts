import { Router, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { UserService } from './user/user.service';
import { inject } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'auth',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },

  {
    path: 'products',
    loadChildren: () =>
      import('./product/product.routes').then((m) => m.PRODUCT_ROUTES),
  },

  {
    path: 'basket',
    loadChildren: () =>
      import('./basket/basket.routes').then((m) => m.BASKET_ROUTES),
    canActivate: [
      () => {
        const userService = inject(UserService);
        const router = inject(Router);

        // Block admins from reaching this page reactively before it loads
        if (userService.getUserRole() === 'ADMIN') {
          router.navigateByUrl('/products/all');
          return false;
        }
        return true;
      },
    ],
  },

  {
    path: 'users',
    loadChildren: () =>
      import('./admin/users-list/users.routes').then((m) => m.USERS_ROUTES),
  },

  {
    path: 'contact',
    component: ContactComponent,
  },

  {
    path: '404',
    component: PageNotFoundComponent,
  },

  // path:'**' must be declared last
  { path: '**', redirectTo: '/404' },
];
