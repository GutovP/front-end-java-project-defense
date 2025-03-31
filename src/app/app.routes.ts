import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { HomeComponent } from './home/home.component';

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
    loadChildren: () => import('./basket/basket.routes').then((m) => m.BASKET_ROUTES),
  },

  {
    path: '404',
    component: PageNotFoundComponent,
  },

  // path:'**' must be declared last
  { path: '**', redirectTo: '/404' },
];
