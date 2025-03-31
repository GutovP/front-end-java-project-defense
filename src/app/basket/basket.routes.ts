import { Routes } from "@angular/router";


export const BASKET_ROUTES: Routes = [

    {
        path: 'view',
        loadComponent: () => import('../basket/basket.component').then((m) => m.BasketComponent)
    },

]