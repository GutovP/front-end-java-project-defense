import { Routes } from '@angular/router';
import { adminGuard } from '../../shared/guards/admin.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./users-list.component').then((m) => m.UsersListComponent),
  },
];
