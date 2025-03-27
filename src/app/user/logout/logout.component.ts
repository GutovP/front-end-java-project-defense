import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ToastService } from '../../core/toast/toast.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit{

  constructor(private userService: UserService, private router: Router, private toastService: ToastService) {

  }

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.userService.logout();
    this.toastService.activate('Successfully logged out!');
    this.router.navigate(['']);
  }
}
