import { Component, inject } from '@angular/core';
import { BasketService } from './basket.service';
import { CommonModule } from '@angular/common';
import { Basket } from '../core/models/basket';
import { UserService } from '../user/user.service';
import { ToastService } from '../core/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-basket',
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent {
  private basketService = inject(BasketService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  basket: Basket | undefined | null;

  ngOnInit(): void {
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
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.userService.getToken(),
    };

    this.basketService
      .updateItemQuantity(productId, newQuantity, headers)
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
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.userService.getToken(),
    };

    this.basketService.removeFromBasket(basketItemId, headers).subscribe({
      next: (response) => {
        this.basket = response;
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.activate(err.error.message);
      },
    });
  }
}
