import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../core/toast/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { BasketService } from '../../basket/basket.service';
import { Product } from '../../core/models/product';
import { Basket } from '../../core/models/basket';

@Component({
  selector: 'app-product-details',
  imports: [ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
 
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private basketService = inject(BasketService);
  private activatedRoute = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private router = inject(Router);
 
  product = signal<Product | null>(null);
  basket = signal<Basket | null>(null);

  quantity = new FormControl(1);

  readonly isAdmin = computed(() => this.userService.getUserRole() === 'ADMIN');

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(): void {
    this.activatedRoute.params.subscribe((params) => {
      const category = params['category'];
      const name = params['name'];

      this.productService.getProductDetails(category, name).subscribe({
        next: (product) => {
          this.product.set(product);
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

      const quantity = this.quantity.getRawValue();

      this.productService
        .updateProductQuantity(category, name, quantity!)
        .subscribe({
          next: () => {
            this.toastService.activate('Quantity updated successfully');
          },
          error: (error: HttpErrorResponse) => {
            this.toastService.activate(error.error.message);
          },
        });
    });
  }

  addToBasket(productId: string) {
    this.basketService.addToBasket(productId, 1).subscribe({
      next: (response) => {
        this.toastService.activate('Product added to basket.');
        this.basket.set(response);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastService.activate(
            'You have to log in to add product to the basket.'
          );
          this.router.navigate(['auth/login']);
        } else {
          this.toastService.activate(error.error.message);
        }
      },
    });
  }
  deleteProduct(productId: string) {
    
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.toastService.activate('Product deleted from the DB.');
      },
      error: (error: HttpErrorResponse) => {

         if (error.status === 401) {
          this.toastService.activate(
            'You have to log in as ADMIN to delete a product!'
          );
          this.router.navigate(['auth/login']);
        } else {
          this.toastService.activate(error.error.message);
        }
      }
    })
  }


}
