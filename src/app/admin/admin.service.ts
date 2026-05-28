import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../core/models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';


const baseUrl = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient)

  getAllUsers(): Observable<User[]> {
    
    return this.http.get<User[]>(`${baseUrl}/admin/users`);
  }

  updateUserRole(userId: string, newRole: string): Observable<void> {
    return this.http.put<void>(`${baseUrl}/admin/${userId}/role?newRole=${newRole}`, {});
  }

  deleteUser(userId:string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/admin/${userId}`);
  }
}
