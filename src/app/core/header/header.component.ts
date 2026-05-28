import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

import { HeaderItems } from './header-items';
import { UserService } from '../../user/user.service';
import { Product } from '../models/product';
import { ProductService } from '../../product/product.service';
import { BasketService } from '../../basket/basket.service'; // BasketService importiert

@Component({
  selector: 'app-header',
  standalone: true, // Explizit für Angular 19
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserService);
  private productService = inject(ProductService);
  private basketService = inject(BasketService);
  private router = inject(Router);

  
  readonly isLoggedIn = this.userService.isLoggedIn;
  readonly isAdmin = computed(() => this.userService.getUserRole() === 'ADMIN');
  readonly basketCount = this.basketService.basketCount;
  readonly firstName = computed(() => this.userService.currentUser()?.firstName || '');
  readonly showProductNav = signal<boolean>(false);
  readonly navbarCollapsed = signal<boolean>(true);
  readonly categories = signal<Product[]>([]);

  headerItems: HeaderItems[] = [];
  authItems: HeaderItems[] = [];
  unAuthItems: HeaderItems[] = [];

  ngOnInit(): void {
    this.headerItems = [
      { caption: 'Home', link: [''] },
      { caption: 'Flower shop', link: ['/products/all'] },
      { caption: 'Contact', link: ['/contact'] },
      { caption: 'Users', link: ['/users'] },
    ];

    this.authItems = [
      { caption: 'Profile', link: ['/auth/profile'] },
      { caption: 'Logout', link: ['/auth/logout'] },
    ];

    this.unAuthItems = [
      { caption: 'Login', link: ['/auth/login'] },
      { caption: 'Register', link: ['/auth/register'] },
    ];

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkUrl(event.urlAfterRedirects);
      });

    this.getCategories();
    this.checkUrl(this.router.url);
    
    this.basketService.loadBasket();
  }

  getCategories(): void {
    this.productService.getCategories().subscribe((categories) => {
      this.categories.set(categories || []);
    });
  }

  checkUrl(url: string): void {
    const allowedPaths = ['/products', '/basket'];
    const isAllowed = allowedPaths.some((path) => url.includes(path));
    this.showProductNav.set(isAllowed);
  }

  toggleNavbar(): void {
    this.navbarCollapsed.update(current => !current);
  }
}
