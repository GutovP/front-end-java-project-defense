import { Component, inject, signal } from '@angular/core';
import { User } from '../../core/models/user';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/toast/toast.service';
import { UserService } from '../../user/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);
  private userService = inject(UserService);

  users = signal<User[]>([]);

  
  constructor () { 
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data || []);
      },
      error: (err) => {
        if (err) {
          this.toastService.activate('Only admins can see the user list');
        }
      },
    });
  }

  updateRole(userId: string, newRole: string): void {
    this.adminService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        this.users.update(currentUsers => 
          currentUsers.map(u => u.id === userId ? { ...u, role: newRole } : u)
        );
        this.toastService.activate('User role updated successfully.');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.activate(error.error?.message || 'Could not update role');
      },
    });
  }
  deleteUser(userId: string): void {
    
    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.toastService.activate('User deleted from the DB.');
        this.users.update(currentUsers => currentUsers.filter(u => u.id !== userId));
      },
      error: (error: HttpErrorResponse) => {

        if (error.status === 401) {
          this.toastService.activate('You have to log in as ADMIN to delete a user!');
          this.userService.logout();
        } else {
          this.toastService.activate(error.error?.message || 'Error while deleting!');
        }
      }
    })
  }
}
