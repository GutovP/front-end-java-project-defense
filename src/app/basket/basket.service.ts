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

  addToBasket(productId: string, quantity: number, headers: any) {
    return this.http.post(`${baseUrl}/basket/add`,{ productId, quantity },{ headers: new HttpHeaders(headers) });
  }

  viewBasket(): Observable<Basket> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Basket>(`${baseUrl}/basket/view`, { headers });
  }

  updateItemQuantity(productId: string, newQuantity: number, headers: any): Observable<any> {

    return this.http.put(`${baseUrl}/basket/${productId}/quantity?newQuantity=${newQuantity}`, {newQuantity}, { headers: new HttpHeaders(headers) });

  }

  removeFromBasket(basketItemId: string, headers: any): Observable<any> {

    return this.http.delete(`${baseUrl}/basket/${basketItemId}/remove`, {headers: new HttpHeaders(headers)});
  }
}
