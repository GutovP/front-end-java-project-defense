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

  constructor() {}

  getProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(`${baseUrl}/products`);
  }

  getProductDetails(category: string, name: string): Observable<Product[]> {

    return this.http.get<Product[]>(`${baseUrl}/products/${category}/${name}`);
  }
  getProductsByCategory(category: string): Observable<Product[]> {

    return this.http.get<Product[]>(`${baseUrl}/products/${category}`);
  }

  addProduct(name: string, description: string, salePrice: number, image: string, category: string, quantity: number): Observable<Product> {

    return this.http.post<Product>(`${baseUrl}/products/add-new-product`,{ name, description, salePrice, image, category, quantity });
  }

  updateProductQuantity(category: string, name: string, quantity: number): Observable<Product> {

    return this.http.put<Product>(`${baseUrl}/products/${category}/${name}`, {quantity});
  }


}
