import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';

export const BASKET_ROUTES: Routes = [
  {
    path: 'view',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../basket/basket.component').then((m) => m.BasketComponent),
  },
];
