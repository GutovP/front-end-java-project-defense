import { Component, computed, inject, OnInit } from '@angular/core';
import { BasketService } from './basket.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../user/user.service';
import { ToastService } from '../core/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-basket',
  imports: [CommonModule, RouterLink],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent implements OnInit {
  private basketService = inject(BasketService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  basket = this.basketService.basket;
  readonly isAdmin = computed(() => this.userService.getUserRole() === 'ADMIN');

  ngOnInit(): void {
    this.viewBasket();
  }

  viewBasket(): void {
    this.basketService.viewBasket().subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.userService.logout();
          this.toastService.activate('Please login to view your basket');

        } else if (err.status === 404) {
          this.toastService.activate('Your basket is empty');

        } else {
          this.toastService.activate(err.message || 'Could not load basket')
        }
      },
    });
  }

  updateQuantity(productId: string, newQuantity: number): void {
    this.basketService.updateItemQuantity(productId, newQuantity).subscribe({
      error: (err: HttpErrorResponse) => {
        this.toastService.activate(
          err.error.message || err.message || 'Could not update quantity',
        );
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
  removeFromBasket(basketItemId: string): void {
    this.basketService.removeFromBasket(basketItemId).subscribe({
      error: (err: HttpErrorResponse) => {
        this.toastService.activate(err.error.message || err.message || 'Could not remove item');
      },
    });
  }
}