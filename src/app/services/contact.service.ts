import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Contact } from '../interfaces/contact.model';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:5283/Contact';
  constructor(private httpClient : HttpClient) { }

 
  getContacts(): Observable<Contact[]> {
    return this.httpClient.get(this.apiUrl, { headers: { 'Accept': 'text/plain' }, responseType: 'text' })
      .pipe(
        map(response => JSON.parse(response) as Contact[])
      );
  }

  getContactById(id: number){
    return this.httpClient.get<Contact>(`${this.apiUrl}/${id}`);
  }
  addContact(contact: Contact){
    return this.httpClient.post<Contact>(this.apiUrl, contact);
  } 
  updateContact(contact: Contact){
    return this.httpClient.put<void>(`${this.apiUrl}/${contact.id}`, contact);
  }
  deleteContact(id: number){
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }
}
