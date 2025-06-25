import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../core/toast/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { BasketService } from '../../basket/basket.service';
import { Product } from '../../core/models/product';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, ReactiveFormsModule],
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
 
  products: Product[] | undefined;
  basket: any[] = [];

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
        this.basket.push(response);
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
