import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  images: string[] = [
    'assets/hero1.jpeg',
    'assets/hero2.jpeg',
    'assets/hero33.jpeg',
    'assets/hero4.jpeg'
  ];

  currentIndex = 0;

  constructor() {
    this.startAutoSlide();
  }

  // Start auto-slide every 5 seconds
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

  events = [
    {
      title: 'Tech Symposium 2025',
      date: 'March 20, 2025',
      location: 'Harvard University, MA',
      image: 'assets/techevent.jpeg',
      category: 'Technology'
    },
    {
      title: 'University Sports Day',
      date: 'July 22, 2025',
      location: 'Oxford University, UK',
      image: 'assets/sportevent.jpeg',
      category: 'Sports'
    },
    {
      title: 'College Comedy Jam',
      date: 'August 14, 2025',
      location: 'Yale University, CT',
      image: 'assets/comedyevent.jpeg',
      category: 'Comedy'
    },
    {
      title: 'University Music Fest',
      date: 'April 15, 2025',
      location: 'Stanford University, CA',
      image: 'assets/musicevent.jpeg',
      category: 'Music'
    },
    {
      title: 'AI & Robotics Expo',
      date: 'May 10, 2025',
      location: 'MIT, Cambridge',
      image: 'assets/roboticsevent.jpeg',
      category: 'Innovation'
    },
    {
      title: 'Campus Movie Night',
      date: 'June 5, 2025',
      location: 'UCLA, Los Angeles',
      image: 'assets/movieevent.jpeg',
      category: 'Entertainment'
    }

  ];
}
