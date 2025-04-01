import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderItems } from './header-items';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserService);

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.userService.getUserRole() === 'ADMIN';
  }
  getFirstName(): string {
    return this.userService.user?.firstName!;
  }
  headerItems: HeaderItems[] = [];
  authItems: HeaderItems[] = [];
  unAuthItems: HeaderItems[] = [];

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.

    this.headerItems = [
      { caption: 'Home', link: [''] },
      { caption: 'About', link: [] },
      { caption: 'Contact', link: [] },
      { caption: 'Users', link: ['/users/all'] },
    ];

    this.authItems = [
      { caption: 'Profile', link: ['/auth/profile'] },
      { caption: 'Logout', link: ['/auth/logout'] },
    ];

    this.unAuthItems = [
      { caption: 'Login', link: ['/auth/login'] },
      { caption: 'Register', link: ['/auth/register'] },
    ];
  }
}
