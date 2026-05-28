import { Routes } from '@angular/router';
import { AdminActivate } from '../../shared/guards/admin.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AdminActivate],
    loadComponent: () =>
      import('./users-list.component').then((m) => m.UsersListComponent),
  },
];
