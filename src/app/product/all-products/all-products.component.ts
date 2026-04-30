import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product';
import { ProductService } from '../product.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-all-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css'
})
export class AllProductsComponent {

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
