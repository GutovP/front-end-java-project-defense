import { Routes } from "@angular/router";


export const USERS_ROUTES: Routes = [
    {
        path: 'all',
        loadComponent: () => import('./users-list.component').then((m) => m.UsersListComponent),
    }
]