import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../product.service';
import { ToastService } from '../../core/toast/toast.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product',
  imports: [ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private fb = inject(NonNullableFormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  productForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    salePrice: [0, [Validators.required, Validators.min(0.01)]],
    imageUrl: ['', [Validators.required]],
    category: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  productHandler() {

    if (this.productForm.invalid) {
      return;
    }

    const productData = this.productForm.getRawValue();

    this.productService
      .addProduct(
        productData.name, 
        productData.description, 
        productData.salePrice, 
        productData.imageUrl, 
        productData.category, 
        productData.quantity)
        .subscribe({

        next: () => {
          this.toastService.activate('Product added successfully');
          this.productForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.handleUnauthorized();
          } else {
            this.toastService.activate(error.error.message || 'An error occurred');
          }
        },
      });
  }

  handleUnauthorized(): void {
    this.userService.logout();
    this.toastService.activate('Your session has expired. Please login again.');
    this.router.navigate(['/auth/login']);
  }
}
