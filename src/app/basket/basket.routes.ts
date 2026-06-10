import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

export const BASKET_ROUTES: Routes = [
  {
    path: 'view',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../basket/basket.component').then((m) => m.BasketComponent),
  },
];
