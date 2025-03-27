import { Component, inject } from '@angular/core';
import { ProductService } from '../product.service';
import { ToastService } from '../../core/toast/toast.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  productForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    salePrice: [0, [Validators.required]],
    imageUrl: ['', [Validators.required]],
    category: ['', [Validators.required]],
    quantity: [1, [Validators.required]],
  });

  productHandler() {
    if (this.productForm.invalid) {
      return;
    }

    const { name, description, salePrice, imageUrl, category, quantity } =
      this.productForm.value;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.userService.getToken(),
    };

    this.productService
      .addProduct(
        name!,
        description!,
        salePrice!,
        imageUrl!,
        category!,
        quantity!,
        headers
      )
      .subscribe({
        next: (product) => {
          this.toastService.activate('Product added successfully');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.handleUnauthorized();
          } else {
            this.toastService.activate(error.error.message);
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
