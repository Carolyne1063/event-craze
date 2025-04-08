import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Event {
  id: string;
  eventName: string;
  image: string;
  date: string;
  time: string;
  location: string;
  description: string;
  totalTickets: number; 
  tickets: { type: string; price: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events'; // Change this to match your backend URL

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, eventData);
  }
  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${event.id}`, event); // PUT request for updating
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`);
  }

  getEventById(eventId: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${eventId}`);
  }

}