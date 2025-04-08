import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api/bookings'; // Adjust if necessary

  constructor(private http: HttpClient) {}

  createBooking(userId: string, eventId: string, ticketType: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, { userId, eventId, ticketType, quantity });
  }

  getUserBookings(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  getBookingById(bookingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${bookingId}`);
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookingId}`);
  }

  updateBooking(bookingId: string, newQuantity: number, newTicketType?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${bookingId}`, { newQuantity, newTicketType });
  }

  // ✅ New method: Get bookings by event ID
  getBookingsByEvent(eventId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/${eventId}`);
  }
}
