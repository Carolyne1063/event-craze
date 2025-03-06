import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent {
  eventsList = [
    {
      id: 1,
      name: "Tech Conference 2025",
      date: new Date(2025, 5, 20),
      time: "10:00 AM - 5:00 PM",
      location: "Nairobi, Kenya",
      imageUrl: "assets/roboticsevent.jpeg",
      tickets: [
        { type: "VIP", remaining: 10 },
        { type: "General", remaining: 50 },
        { type: "Student", remaining: 20 }
      ],
      revenue: 12000,
      bookings: [
        { name: "John Doe", email: "john@example.com", phone: "123-456-7890", imageUrl: "https://randomuser.me/api/portraits/men/1.jpg", canceled: false },
        { name: "Alice Smith", email: "alice@example.com", phone: "987-654-3210", imageUrl: "https://randomuser.me/api/portraits/women/3.jpg", canceled: true }
      ]      
    },
    {
      id: 2,
      name: "Music Festival",
      date: new Date(2025, 6, 10),
      time: "6:00 PM - 12:00 AM",
      location: "Mombasa, Kenya",
      imageUrl: "https://i.pinimg.com/474x/ff/0f/ac/ff0fac03490309a5e360d9ff3bb467ce.jpg",
      tickets: [
        { type: "VIP", remaining: 5 },
        { type: "General", remaining: 30 },
        { type: "Student", remaining: 10 }
      ],
      revenue: 8000,
      bookings: [
        { name: "Jane Doe", email: "jane@example.com", phone: "456-789-1234", imageUrl: "https://randomuser.me/api/portraits/women/2.jpg", canceled: false } // Ensure canceled property exists
      ]
    }
  ];

  selectedEvent = this.eventsList[0];

  selectEvent(event: any) {
    this.selectedEvent = event;
  }
}
