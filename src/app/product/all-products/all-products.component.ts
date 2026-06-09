import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product';
import { ProductService } from '../product.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-all-products',
  imports: [RouterLink],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css',
})
export class AllProductsComponent {
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private router = inject(Router);

  readonly products = signal<Product[]>([]);
  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    return this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
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
