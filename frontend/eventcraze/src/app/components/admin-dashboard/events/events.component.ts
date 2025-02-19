import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Event {
  id: string;
  name: string;
  image: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  tickets: { type: string; price: number }[];
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events: Event[] = [
    { 
      id: '1', 
      name: 'Concert in the Park', 
      image: 'assets/musicevent.jpeg', 
      date: '2025-05-01', 
      location: 'Central Park', 
      category: 'Music', 
      description: 'A fun outdoor concert with live music performances.',
      time: '18:00',
      tickets: [{ type: 'VIP', price: 100 }, { type: 'Regular', price: 50 }]
    },
    { 
      id: '2', 
      name: 'Tech Conference', 
      image: 'assets/roboticsevent.jpeg', 
      date: '2025-06-15', 
      location: 'Tech Hub', 
      category: 'Technology', 
      description: 'A conference for tech enthusiasts and professionals.',
      time: '09:00',
      tickets: [{ type: 'VIP', price: 200 }, { type: 'Regular', price: 75 }]
    },
    {
      id: '3',
      name: 'Food Festival',
      image: 'assets/unifriends.jpeg',
      date: '2025-08-20',
      location: 'City Square',
      category: 'Food & Drink',
      description: 'A festival featuring different cuisines and live cooking shows.',
      time: '12:00',
      tickets: [{ type: 'General', price: 30 }]
    }
  ];

  newEvent: Event = {
    id: '',
    name: '',
    image: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    tickets: [{ type: '', price: 0 }]
  };

  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  showDeleteConfirm: boolean = false;
  currentEventId: string | null = null;

  constructor() {}

  // Open form for creating an event
  openCreateForm(): void {
    this.showCreateForm = true;
  }

  // Create a new event only if all fields are filled
  createEvent(): void {
    if (this.isFormValid()) {
      console.log('Creating event:', this.newEvent);
      this.events.push({
        ...this.newEvent,
        id: (this.events.length + 1).toString() // Add the id after spreading newEvent
      });
      
      this.resetForm();
      this.showCreateForm = false;
    }
  }

  // Update existing event
  updateEvent(): void {
    if (this.isFormValid()) {
      const eventIndex = this.events.findIndex(event => event.id === this.newEvent.id);
      if (eventIndex !== -1) {
        this.events[eventIndex] = { ...this.newEvent };
      }
      this.resetForm();
      this.showEditForm = false;
    }
  }

  // Validate the form before submitting
  isFormValid(): boolean {
    return (
      Boolean(this.newEvent.name) &&
      Boolean(this.newEvent.date) &&
      Boolean(this.newEvent.location) &&
      Boolean(this.newEvent.category) &&
      Boolean(this.newEvent.description) &&
      Boolean(this.newEvent.image) &&
      this.newEvent.tickets.length > 0
    );
  }
  
  // Cancel creating or editing event
  cancelCreateEvent(): void {
    this.resetForm();
    this.showCreateForm = false;
    this.showEditForm = false;
  }

  // Reset the form data
  resetForm(): void {
    this.newEvent = {
      id: '',
      name: '',
      image: '',
      date: '',
      time: '',
      location: '',
      description: '',
      category: '',
      tickets: [{ type: '', price: 0 }]
    };
  }

  // Edit an event
  editEvent(eventId: string): void {
    const event = this.events.find(event => event.id === eventId);
    if (event) {
      this.newEvent = { ...event };
      this.showEditForm = true;
    }
  }

  // Confirm deletion of an event
  confirmDelete(eventId: string): void {
    this.showDeleteConfirm = true;
    this.currentEventId = eventId;
  }

  // Delete an event
  deleteEvent(eventId: string): void {
    this.events = this.events.filter(event => event.id !== eventId);
    this.showDeleteConfirm = false;
    this.currentEventId = null;
  }

  // Cancel deletion
  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.currentEventId = null;
  }

  // Add new ticket to the event form
  addTicket(): void {
    this.newEvent.tickets.push({ type: '', price: 0 });
  }

  // Remove ticket from the event form
  removeTicket(index: number): void {
    this.newEvent.tickets.splice(index, 1);
  }
}
