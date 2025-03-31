import { Component, inject } from '@angular/core';
import { BasketService } from './basket.service';
import { CommonModule } from '@angular/common';
import { Basket } from '../core/models/basket';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-basket',
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent {
  private basketService = inject(BasketService);
  private userService = inject(UserService)
  basket: Basket | undefined;

  ngOnInit(): void {
    this.viewBasket();
  }

  viewBasket() {
    this.basketService.viewBasket().subscribe({
      next: (basket) => {
        this.basket = basket;
      },
      error: (err) => {
        console.error('Failed to load basket', err);
      },
    });
  }

  updateQuantity(productId: string, newQuantity: number) {

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.userService.getToken(),
    };

    this.basketService.updateItemQuantity(productId, newQuantity, headers).subscribe({
      next: (updatedBasket) => {
        this.basket = updatedBasket;
      },

      error: (err) => {
        console.error('Failed to update quantity', err);
      },
    });
  }
}
