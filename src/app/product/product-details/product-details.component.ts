import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../core/toast/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  products: any[] = [];
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private activatedRoute = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  quantity = new FormControl(1);

  get isAdmin(): boolean {
    return this.userService.getUserRole() === 'ADMIN';
  }

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(): void {
    this.activatedRoute.params.subscribe((params) => {
      const category = params['category'];
      const name = params['name'];

      this.productService.getProductDetails(category, name).subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
    });
  }

  updateQuantity(): void {
    this.activatedRoute.params.subscribe((params) => {

      const category = params['category'];
      const name = params['name'];

      const quantity = this.quantity.value;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.userService.getToken(),
      };

      this.productService.updateProductQuantity(category, name, quantity!, headers).subscribe({
        next: () => {
          this.toastService.activate('Quantity updated successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.activate(error.error.message);
        },
      });
    });
  }
}
