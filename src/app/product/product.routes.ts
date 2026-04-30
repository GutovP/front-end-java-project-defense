import { Routes } from '@angular/router';
import { AdminActivate } from '../shared/guards/admin.guard';

export const PRODUCT_ROUTES: Routes = [
  {
    path: 'all',
    loadComponent: () => import('../product/all-products/all-products.component').then((m) => m.AllProductsComponent),
  },

  {
    path: ':category/:name',
    loadComponent: () => import('./product-details/product-details.component').then((m) => m.ProductDetailsComponent),
  },

  {
    path: 'add-new',
    loadComponent: () => import('./add-new/product.component').then((m) => m.ProductComponent),
    canActivate: [AdminActivate],
  },

  {
    path: ':category',
    loadComponent: () => import('./category-details/category-details.component').then((m) => m.CategoryDetailsComponent),
  }
];
