import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Basket } from '../core/models/basket';

const baseUrl = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private http = inject(HttpClient);

  addToBasket(productId: string, quantity: number) {
    return this.http.post(`${baseUrl}/basket/add`,{ productId, quantity });
  }

  viewBasket(): Observable<Basket> {
    return this.http.get<Basket>(`${baseUrl}/basket/view`);
  }

  updateItemQuantity(productId: string, newQuantity: number): Observable<any> {
    return this.http.put(`${baseUrl}/basket/${productId}/quantity?newQuantity=${newQuantity}`, {newQuantity});
  }

  removeFromBasket(basketItemId: string): Observable<any> {

    return this.http.delete(`${baseUrl}/basket/${basketItemId}/remove`);
  }
}
