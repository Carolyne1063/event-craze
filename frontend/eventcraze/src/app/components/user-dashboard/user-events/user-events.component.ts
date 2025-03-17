import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../services/eventService';
import { BookingService } from '../../../services/bookingService';
import { AuthService } from '../../../auth.service';

interface Event {
  id: string;
  eventName: string;
  image: string;
  date: string;
  time: string;
  location: string;
  description: string;
  tickets: { type: string; price: number }[];
}

@Component({
  selector: 'app-user-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-events.component.html',
  styleUrl: './user-events.component.css'
})
export class UserEventsComponent implements OnInit {
  events: Event[] = [];
  selectedEvent: Event | null = null;
  selectedTicketType: string = '';
  selectedQuantity: number = 1;

  constructor(private eventService: EventService, private bookingService: BookingService,   private authService: AuthService // Inject AuthService here
  ) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
      },
      error: (err: any) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  openBookingForm(event: Event) {
    this.selectedEvent = event;
    this.selectedTicketType = event.tickets.length > 0 ? event.tickets[0].type : '';
    this.selectedQuantity = 1;
  }

  bookTicket() {
    if (!this.selectedEvent || !this.selectedTicketType || this.selectedQuantity < 1) {
      alert('Please select a ticket type and quantity.');
      return;
    }
  
    const userId = this.authService.getUserId(); // Retrieve user ID from AuthService
    if (!userId) {
      alert('User not logged in. Please log in to book tickets.');
      return;
    }
  
    const eventId = this.selectedEvent.id;
    const ticketType = this.selectedTicketType;
    const quantity = this.selectedQuantity; // Ensure it's a number
  
    this.bookingService.createBooking(userId, eventId, ticketType, quantity).subscribe({
      next: (response) => {
        alert(`Successfully booked ${this.selectedQuantity} ticket(s) for ${this.selectedEvent?.eventName}!`);
        this.cancelBooking();
      },
      error: (error) => {
        console.error('Error booking event:', error);
        alert('Failed to book ticket. Please try again.');
      }
    });
  }
  
  cancelBooking() {
    this.selectedEvent = null;
  }
}
