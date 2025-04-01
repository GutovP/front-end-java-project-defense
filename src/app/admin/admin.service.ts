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

    const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

    return this.http.get<User[]>(`${baseUrl}/admin/users`, {headers});
  }

  updateUserRole(userId: string, newRole: string, headers: any): Observable<any> {

    return this.http.put(`${baseUrl}/admin/${userId}/role?newRole=${newRole}`, {newRole}, {headers: new HttpHeaders(headers)});
  }
}
