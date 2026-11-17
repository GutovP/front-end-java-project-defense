import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../core/toast/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { BasketService } from '../../basket/basket.service';
import { Product } from '../../core/models/product';

@Component({
  selector: 'app-product-details',
  imports: [ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private basketService = inject(BasketService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  readonly product = signal<Product | null>(null);
  readonly zoomedImagesState = signal<string[]>([]);
  readonly zoomedIndexState = signal(0);
  readonly basket = this.basketService.basket;

  readonly quantity = new FormControl<number>(1, { nonNullable: true });
  readonly isAdmin = computed(() => this.userService.getUserRole() === 'ADMIN');
  readonly zoomedImage = computed(
    () => this.zoomedImagesState()[this.zoomedIndexState()] ?? null,
  );

  category = input.required<string>();
  name = input.required<string>();

  constructor() {
    effect(() => {
      this.productService
        .getProductDetails(this.category(), this.name())
        .subscribe({
          next: (product) => {
            this.product.set(product);
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
          },
        });
    });
  }

  updateQuantity(): void {
    const quantity = this.quantity.value;

    this.productService
      .updateProductQuantity(this.category(), this.name(), quantity)
      .subscribe({
        next: () => {
          this.toastService.activate('Quantity updated successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.activate(error.error.message);
        },
      });
  }

  addToBasket(productId: string) {
    this.basketService.addToBasket(productId, 1).subscribe({
      next: () => {
        this.toastService.activate('Product added to basket.');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastService.activate(
            'You have to log in to add product to the basket.',
          );
          this.router.navigate(['auth/login']);
        } else {
          this.toastService.activate(error.error.message);
        }
      },
    });
  }
  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.toastService.activate('Product deleted from the DB.');
        this.router.navigate(['/products']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastService.activate(
            'You have to log in as admin to delete a product!',
          );
          this.router.navigate(['auth/login']);
        } else {
          this.toastService.activate(error.error.message);
        }
      },
    });
  }
  openImage(event: MouseEvent, images: string[]): void {
    event.preventDefault();
    event.stopPropagation();
    this.zoomedImagesState.set(images);
    this.zoomedIndexState.set(0);
  }
  closeImage(): void {
    this.zoomedImagesState.set([]);
  }
  nextImage(): void {
    this.zoomedIndexState.update(
      (i) => (i + 1) % this.zoomedImagesState().length,
    );
  }
  prevImage(): void {
    const len = this.zoomedImagesState().length;
    this.zoomedIndexState.update((i) => (i - 1 + len) % len);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.zoomedImagesState.set([]);
  }

  @HostListener('document:keydown.arrowRight')
  onArrowRight(): void {
    if (this.zoomedImagesState().length > 1) {
      this.nextImage();
    }
  }

  @HostListener('document:keydown.arrowLeft')
  onArrowLeft(): void {
    if (this.zoomedImagesState().length > 1) {
      this.prevImage();
    }
  }
}
