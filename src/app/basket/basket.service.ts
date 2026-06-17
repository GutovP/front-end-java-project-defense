import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Basket } from '../core/models/basket';

const baseUrl = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private http = inject(HttpClient);
  private basketState = signal<Basket | null>(null);
  readonly basket = this.basketState.asReadonly();

  readonly basketCount = computed(() => {
    const basket = this.basketState();

    if (!basket || !basket.items) {
      return 0;
    }
    return basket.items.reduce((total, item) => total + item.quantity, 0);
  });

  setBasket(basket: Basket | null): void {
    this.basketState.set(basket);
  }
  loadBasket(): void {
    this.viewBasket().subscribe({
      next: (basket) => {
        if (!basket.items || basket.items.length === 0) {
          this.basketState.set(null);
        } else {
          this.basketState.set(basket);
        }
      },
      error: () => {
        this.basketState.set(null);
        console.log('Basket initialization skipped or user unauthenticated.')
      }
    });
  }

  addToBasket(productId: string, quantity: number): Observable<Basket> {
    return this.http.post<Basket>(`${baseUrl}/basket`,{ productId, quantity })
    .pipe(
      tap(updatedBasket => this.basketState.set(updatedBasket))
    );
  }

  viewBasket(): Observable<Basket> {
    return this.http.get<Basket>(`${baseUrl}/basket`);
  }

  updateItemQuantity(productId: string, newQuantity: number): Observable<Basket> {
    return this.http.put<Basket>(`${baseUrl}/basket/${productId}/quantity?newQuantity=${newQuantity}`, {})
    .pipe(
      tap( (updatedBasket) => {
        this.basketState.set(updatedBasket);
      })
    );
  }

  removeFromBasket(basketItemId: string): Observable<Basket> {

    return this.http.delete<Basket>(`${baseUrl}/basket/${basketItemId}`)
    .pipe(
      tap((updatedBasket) => {
        if (!updatedBasket || !updatedBasket.items || updatedBasket.items.length === 0) {
          this.basketState.set(null);

        } else {
          this.basketState.set(updatedBasket);
        }
      })
    );
  }
}