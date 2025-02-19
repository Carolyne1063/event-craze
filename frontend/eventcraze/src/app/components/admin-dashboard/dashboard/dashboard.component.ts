import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalBookings: number = 120;
  totalRevenue: number = 30500;
  upcomingEvents: number = 8;
  activeUsers: number = 450;

  events = [
    { name: "Music Festival", salesPercentage: 85, ticketsSold: 850, totalTickets: 1000 },
    { name: "Tech Conference", salesPercentage: 60, ticketsSold: 600, totalTickets: 1000 },
    { name: "Sports Tournament", salesPercentage: 75, ticketsSold: 750, totalTickets: 1000 },
  ];

  topManagers = [
    { name: "Alice Johnson", revenueGenerated: 12000 },
    { name: "David Smith", revenueGenerated: 9800 },
    { name: "Sophia Brown", revenueGenerated: 7500 }
  ];

  recentBookings = [
    { eventName: "Music Festival", userName: "John Doe", tickets: 2, totalPrice: 100 },
    { eventName: "Tech Conference", userName: "Jane Smith", tickets: 1, totalPrice: 200 },
    { eventName: "Sports Tournament", userName: "Emma Wilson", tickets: 3, totalPrice: 150 }
  ];

  constructor() { }

  ngOnInit(): void {
    // You can fetch real data here using an API call
  }
}
