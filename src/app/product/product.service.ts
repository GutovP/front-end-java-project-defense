import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../core/models/product';

const baseUrl = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {}

  getProducts(): Observable<Product[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Product[]>(`${baseUrl}/products/all`, { headers });
  }

  getProductDetails(category: string, name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/products/${category}/${name}`);
  }

  addProduct(name: string, description: string, salePrice: number, image: string, category: string, quantity: number, headers: any): Observable<Product> {

    return this.http.post<Product>(`${baseUrl}/products/add-new-product`,{ name, description, salePrice, image, category, quantity },{ headers: new HttpHeaders(headers) });
  }

  updateProductQuantity(category: string, name: string,quantity: number, headers: any): Observable<Product> {

    return this.http.put<Product>(`${baseUrl}/products/${category}/${name}`, {quantity},{ headers: new HttpHeaders(headers) });

  }


}
