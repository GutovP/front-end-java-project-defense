import { Routes } from '@angular/router';
import { AdminGuard } from '../../shared/guards/admin.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    loadComponent: () =>
      import('./users-list.component').then((m) => m.UsersListComponent),
  },
];
