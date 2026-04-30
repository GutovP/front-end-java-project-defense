import { Routes } from '@angular/router';
import { AuthActivate } from '../../shared/guards/auth.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthActivate],
    loadComponent: () =>
      import('./users-list.component').then((m) => m.UsersListComponent),
  },
];
