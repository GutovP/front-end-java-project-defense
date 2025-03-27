import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../core/models/product';
import { ProductService } from '../product/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../core/toast/toast.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products: Product[] | undefined;
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    return this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.activate(error.error.message);
      }
    })
  }
}
