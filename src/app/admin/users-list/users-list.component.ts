import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { User } from '../../core/models/user';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/toast/toast.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdRef = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  private userService = inject(UserService);

  users: User[] | undefined;

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers() {

    return this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.toastService.activate('Only admins can see the user list');
        }
      },
    });
  }

  updateRole(userId: string, newRole: string): void {
   
    this.adminService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        console.log(`Role updated for user ${userId} to ${newRole}`);

        this.loadAllUsers();
      },
      error: (error) => {
        console.error(error.error.message);
      },
    });
  }
}
