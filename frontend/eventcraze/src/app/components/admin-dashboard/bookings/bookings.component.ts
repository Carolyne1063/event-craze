import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/eventService';
import { BookingService } from '../../../services/bookingService';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit {
  eventsList: any[] = [];
  selectedEvent: any = null;

  constructor(private eventService: EventService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.eventsList = events;
      if (events.length > 0) {
        this.selectEvent(events[0]); 
      }
    });
  }

  selectEvent(event: any): void {
    this.selectedEvent = { ...event, bookings: [] }; 
    this.loadBookings(event.id);
  }

  loadBookings(eventId: string): void {
    this.bookingService.getBookingsByEvent(eventId).subscribe((bookings: any[]) => {
      // Ensure each booking contains user details
      const processedBookings = bookings.map(booking => ({
        ...booking,
        user: booking.user || { 
          firstName: 'Unknown', 
          lastName: '', 
          phoneNo: 'N/A', 
          email: 'N/A', 
          image: 'https://via.placeholder.com/50' 
        }
      }));
      
      this.selectedEvent.bookings = processedBookings; 
    });
  }
}
