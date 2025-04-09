import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
  ticketId?: string;
  eventId: string;
  type: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:3000/api/tickets'; 

  constructor(private http: HttpClient) {}

  // Create a single ticket
  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/create`, ticket);
  }

  // Get tickets by event ID
  getTicketsByEvent(eventId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/event/${eventId}`);
  }

  // Update a ticket
  updateTicket(ticketId: string, quantity: number, price: number): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/update/${ticketId}`, { quantity, price });
  }

  // Delete a ticket
  deleteTicket(ticketId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${ticketId}`);
  }
}
