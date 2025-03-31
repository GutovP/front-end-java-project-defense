import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../core/models/product';
import { ProductService } from '../product/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products: Product[] | undefined;
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    return this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.userService.logout();
          this.router.navigate(['']);
        }
      },
    });
  }
}
