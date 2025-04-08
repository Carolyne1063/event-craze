import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/eventService';

interface Event {
  id: string;
  eventName: string;
  image: string;
  date: string;
  time: string;
  location: string;
  description: string;
  totalTickets: number;
  tickets: { type: string; price: number }[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  images: string[] = [
    'assets/hero1.jpeg',
    'assets/hero2.jpeg',
    'assets/hero33.jpeg',
    'assets/hero4.jpeg'
  ];

  currentIndex = 0;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.startAutoSlide();
  }

  fetchEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data.map(event => ({
          ...event,
          title: event.eventName,     // if your HTML template uses `event.title`
          category: 'Music'           // dummy category, replace if needed
        }));
      },
      error: (err: any) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  startAutoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  prevSlide(): void {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
  }

  nextSlide(): void {
    this.currentIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }
}
