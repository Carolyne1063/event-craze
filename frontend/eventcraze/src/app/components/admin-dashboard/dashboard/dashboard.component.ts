import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EventService } from '../../../services/eventService';
import { BookingService } from '../../../services/bookingService';
import { UserService } from '../../../services/userService'; // make sure this service exists


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  eventsWithBookings: any[] = [];
  totalEvents: number = 0;
  totalUsers: number = 0;
  totalBookings: number = 0;
  totalRevenue: number = 0;


  constructor(
    private eventService: EventService,
    private bookingService: BookingService,
    private userService: UserService


  ) {}

  ngOnInit(): void {
    this.loadEventAnalytics();
    this.loadSummaryStats();
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

  loadSummaryStats() {
    this.eventService.getEvents().subscribe((events: any[]) => {
      this.totalEvents = events.length;

      let bookingsCount = 0;
      let totalRevenue = 0;

      let eventBookingsPromises = events.map((event: any) => {
        return this.bookingService.getBookingsByEvent(event.id).toPromise().then((bookings: any[]) => {
          bookingsCount += bookings.length;
             // 👇 Calculate revenue per event
        const eventRevenue = bookings.reduce((total, booking) => {
          return total + booking.quantity * booking.ticket.price;
        }, 0);

        totalRevenue += eventRevenue;
          return {
            ...event,
            bookings: bookings || [],
          };
        });
      });

      Promise.all(eventBookingsPromises).then((eventData) => {
        this.eventsWithBookings = eventData;
        this.totalBookings = bookingsCount;
        this.totalRevenue = totalRevenue;

      });
    });

    this.userService.getAllUsers().subscribe((users: any[]) => {
      this.totalUsers = users.length;
    });
  }

}
