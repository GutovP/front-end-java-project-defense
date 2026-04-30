import { Routes } from '@angular/router';
import { AuthActivate } from '../shared/guards/auth.guard';

export const BASKET_ROUTES: Routes = [
  {
    path: 'view',
    canActivate: [AuthActivate],
    loadComponent: () =>
      import('../basket/basket.component').then((m) => m.BasketComponent),
  },
];
