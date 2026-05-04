import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterEvent, RouterModule } from '@angular/router';

import { HeaderItems } from './header-items';
import { UserService } from '../../user/user.service';
import { Product } from '../models/product';
import { ProductService } from '../../product/product.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserService);
  private productService = inject(ProductService);
  private router = inject(Router);
  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
  get isAdmin(): boolean {
    return this.userService.getUserRole() === 'ADMIN';
  }
  getFirstName(): string {
    return this.userService.currentUser?.firstName!;
  }
  public showProductNav = false;
  public navbarCollapsed = true;
  headerItems: HeaderItems[] = [];
  authItems: HeaderItems[] = [];
  unAuthItems: HeaderItems[] = [];
  categories: Product[] | undefined;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.

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

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkUrl(event.urlAfterRedirects);
    });

    this.getCategories();
    
    this.checkUrl(this.router.url);
  }

  getCategories() {
    return this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  checkUrl(url: string) {
    const allowedPaths = ['/products', '/basket'];
    this.showProductNav = allowedPaths.some(path => url.includes(path));
  }
  
}
