import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../core/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';


const baseUrl = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient)

  constructor() { }

  getAllUsers(): Observable<User[]> {
    
    return this.http.get<User[]>(`${baseUrl}/admin/users`);
  }

  updateUserRole(userId: string, newRole: string): Observable<any> {
    return this.http.put(`${baseUrl}/admin/${userId}/role?newRole=${newRole}`, {newRole});
  }
}
