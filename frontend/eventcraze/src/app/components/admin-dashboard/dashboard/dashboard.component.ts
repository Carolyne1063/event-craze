import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EventService } from '../../../services/eventService';
import { BookingService } from '../../../services/bookingService';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  eventsWithBookings: any[] = [];

  constructor(
    private eventService: EventService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadEventAnalytics();
  }

  loadEventAnalytics() {
    this.eventService.getEvents().subscribe((events: any[]) => {
      events.forEach((event: { id: any; }) => {
        this.bookingService.getBookingsByEvent(event.id).subscribe((bookings: any) => {
          this.eventsWithBookings.push({
            ...event,
            bookings: bookings || [],
          });
        });
      });
    });
  }

  calculateRevenue(bookings: any[]): number {
    return bookings.reduce((total, booking) => {
      return total + booking.quantity * booking.ticket.price;
    }, 0);
  }

  getCapacityUsage(event: any): number {
    const booked = event.bookings.reduce((sum: number, b: any) => sum + b.quantity, 0);
    return Math.min(100, Math.round((booked / event.totalTickets) * 100));
  }
}
