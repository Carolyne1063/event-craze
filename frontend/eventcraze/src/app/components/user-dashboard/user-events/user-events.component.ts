import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-events',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-events.component.html',
  styleUrl: './user-events.component.css'
})
export class UserEventsComponent {
  events = [
    {
      id: 1,
      name: 'Tech Conference 2025',
      date: 'March 10, 2025',
      location: 'New York, USA',
      category: 'Technology',
      image: 'assets/roboticsevent.jpeg',
      tickets: [
        { type: 'General', price: 50 },
        { type: 'VIP', price: 120 }
      ]
    },
    {
      id: 2,
      name: 'Music Fest',
      date: 'July 22, 2025',
      location: 'Los Angeles, USA',
      category: 'Music',
      image: 'assets/musicevent.jpeg',
      tickets: [
        { type: 'Regular', price: 30 },
        { type: 'Premium', price: 80 }
      ]
    },
    {
      id: 3,
      name: 'Food & Wine Festival',
      date: 'April 15, 2025',
      location: 'Paris, France',
      category: 'Culinary',
      image: 'https://i.pinimg.com/474x/54/3a/67/543a673f02ab58d5a5ec36a5addaf572.jpg',
      tickets: [
        { type: 'Entry Pass', price: 40 },
        { type: 'VIP Experience', price: 100 }
      ]
    },
    {
      id: 4,
      name: 'Fitness Expo 2025',
      date: 'June 5, 2025',
      location: 'Miami, USA',
      category: 'Health & Wellness',
      image: 'https://i.pinimg.com/474x/09/60/bc/0960bc04fb727aa9acd969cc42388dc7.jpg',
      tickets: [
        { type: 'General', price: 25 },
        { type: 'VIP', price: 70 }
      ]
    }
  ];

  selectedEvent: any = null;
  selectedTicketType: string = '';
  selectedQuantity: number = 1;

  openBookingForm(event: any) {
    this.selectedEvent = event;
    this.selectedTicketType = event.tickets[0]?.type || '';
    this.selectedQuantity = 1;
  }

  bookTicket() {
    if (!this.selectedTicketType || this.selectedQuantity < 1) {
      alert('Please select a ticket type and quantity.');
      return;
    }

    alert(`Successfully booked ${this.selectedQuantity} ticket(s) for ${this.selectedEvent.name}!`);
    this.cancelBooking();
  }

  cancelBooking() {
    this.selectedEvent = null;
  }
}