import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

const baseURL = environment.notificationURL;

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private http = inject(HttpClient);

  sendMessage(name:string, email:string, message:string, phoneNumber?:string): Observable<void> {

    return this.http.post<void>(`${baseURL}/notifications`, {name, email, phoneNumber, message});
  }

}
