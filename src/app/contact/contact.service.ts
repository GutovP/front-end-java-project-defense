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
  constructor() { }

  sendMessage(name:string, email:string, message:string, phoneNumber?:string): Observable<any> {

    return this.http.post(`${baseURL}/notifications`, {name, email, phoneNumber, message});
  }

}
