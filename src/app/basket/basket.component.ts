import { Component, inject } from '@angular/core';
import { BasketService } from './basket.service';
import { CommonModule } from '@angular/common';
import { Basket } from '../core/models/basket';
import { UserService } from '../user/user.service';
import { ToastService } from '../core/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-basket',
  imports: [CommonModule, RouterLink],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent {
  private basketService = inject(BasketService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  basket: Basket | undefined | null;

  get isAdmin() {
    return this.userService.getUserRole() === 'ADMIN';
  }
  ngOnInit(): void {
    if(this.isAdmin) {
      this.router.navigateByUrl('/products/all');
    }
    
    this.viewBasket();
  }

  viewBasket(): void {
    this.basketService.viewBasket().subscribe({
      next: (data) => {
        this.basket = data;

        if (!this.basket.items || this.basket.items.length === 0) {
          this.basket = null;
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.userService.logout();
          this.toastService.activate('Please login to view your basket');
        } else if (err.status === 404) {
          this.toastService.activate('Your basket is empty');
        }
      },
    });
  }

  updateQuantity(productId: string, newQuantity: number): void {

    this.basketService
      .updateItemQuantity(productId, newQuantity)
      .subscribe({
        next: () => {
          this.viewBasket();
        },

        error: (err: HttpErrorResponse) => {
          this.toastService.activate(err.error.message);
        },
      });
  }
  increaseQuantity(productId: string, currentQuantity: number): void {
    this.updateQuantity(productId, currentQuantity + 1);
  }
  decreaseQuantity(productId: string, currentQuantity: number): void {
    if (currentQuantity > 1) {
      this.updateQuantity(productId, currentQuantity - 1);
    }
  }
  removeFromBasket(basketItemId: string) {

    this.basketService.removeFromBasket(basketItemId).subscribe({
      next: (response) => {
        this.basket = response;
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.activate(err.error.message);
      },
    });
  }
}
