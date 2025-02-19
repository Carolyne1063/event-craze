import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent {
  bookings = [
    {
      id: 1,
      eventName: 'Jazz Night Live',
      date: 'March 15, 2025',
      location: 'New York City',
      category: 'Music',
      ticketType: 'VIP',
      price: 120,
      quantity: 2,
      status: 'Confirmed',
      image: 'https://i.pinimg.com/474x/23/8c/41/238c4195126175e33e5dc641df6d5c74.jpg'
    },
    {
      id: 2,
      eventName: 'Tech Expo 2025',
      date: 'April 5, 2025',
      location: 'San Francisco',
      category: 'Technology',
      ticketType: 'General',
      price: 50,
      quantity: 1,
      status: 'Pending',
      image: 'assets/roboticsevent.jpeg'
    },
    {
      id: 3,
      eventName: 'Coffee Tasting Tour',
      date: 'May 20, 2025',
      location: 'Seattle',
      category: 'Food & Drinks',
      ticketType: 'Standard',
      price: 30,
      quantity: 3,
      status: 'Cancelled',
      image: 'https://i.pinimg.com/474x/5c/fd/93/5cfd93bf09153e97707fff073ccd309c.jpg'
    }
  ];

  selectedBooking: any = null;
  cancelBookingId: number | null = null;

  openUpdateForm(booking: any) {
    this.selectedBooking = { ...booking };
  }

  saveUpdatedBooking() {
    this.bookings = this.bookings.map(b =>
      b.id === this.selectedBooking.id ? { ...this.selectedBooking } : b
    );
    this.selectedBooking = null;
  }

  cancelUpdate() {
    this.selectedBooking = null;
  }

  openCancelForm(id: number) {
    this.cancelBookingId = id;
  }

  confirmCancelBooking() {
    this.bookings = this.bookings.map(b =>
      b.id === this.cancelBookingId ? { ...b, status: 'Cancelled' } : b
    );
    this.cancelBookingId = null;
  }

  cancelCancelBooking() {
    this.cancelBookingId = null;
  }

  navigateToEvents() {
    console.log('Redirecting to events...');
  }
}
