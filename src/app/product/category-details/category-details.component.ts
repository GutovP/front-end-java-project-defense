import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../../core/models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent implements OnInit{

  private productService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute);
  products: Product[] | undefined;

  ngOnInit(): void {
      this.getCategoryDetails();
  }

  getCategoryDetails(): void {

    this.activatedRoute.params.subscribe((params) => {
          const category = params['category'];
    
          this.productService.getProductsByCategory(category).subscribe({
            next: (products) => {
              this.products = products;
            },
            error: (error: HttpErrorResponse) => {
              console.error(error);
            },
          });
        });
  }

}
