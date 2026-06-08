import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { ProductService } from '../product.service';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../../core/models/product';


@Component({
  selector: 'app-category-details',
  imports: [RouterModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent {

  private productService = inject(ProductService);
  
  readonly products = signal<Product[]>([]);
  category = input.required<string>();

  constructor () {
    
    effect( () => {
      this.productService.getProductsByCategory(this.category()).subscribe({
            next: (products) => {
              this.products.set(products);
            },
            error: (error: HttpErrorResponse) => {
              console.error(error);
            },
          });
    })
  }

}
