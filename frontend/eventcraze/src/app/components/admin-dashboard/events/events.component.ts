import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../services/eventService';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

interface Event {
  id: string;
  eventName: string;
  image: string;
  date: string;
  time: string;
  location: string;
  description: string;
  totalTickets: number;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events: Event[] = [];
  newEvent: Event = this.resetEvent();

  showCreateForm: boolean = false;

  constructor(private eventService: EventService) {}

  // Open the form to create a new event
  openCreateForm(): void {
    this.showCreateForm = true;
    this.newEvent = this.resetEvent();
  }

  // Create event
  createEvent(): void {
    if (this.isFormValid()) {
      console.log('Sending event to backend:', this.newEvent);

      const eventToSend: Event = {
        ...this.newEvent,
        totalTickets: Number(this.newEvent.totalTickets),
        date: this.formatDateForBackend(this.newEvent.date), // Ensure the date is in the correct format
      };

      this.eventService.createEvent(eventToSend).subscribe({
        next: (response) => {
          console.log('Event created successfully:', response);
          if (response && response.id) {
            this.newEvent.id = response.id;
            this.showCreateForm = false; // Close the form after creation
          } else {
            console.error('Event creation failed: No ID received');
          }
        },
        error: (error) => {
          console.error('Error creating event:', error);
        }
      });
    }
  }

  // Validate if the form fields are filled out
  isFormValid(): boolean {
    return !!(this.newEvent.eventName && this.newEvent.date && this.newEvent.location &&
              this.newEvent.description && this.newEvent.image);
  }

  // Reset form and close the event creation form
  cancelCreateEvent(): void {
    this.showCreateForm = false;
    this.newEvent = this.resetEvent();
  }

  // Private method to reset the event form
  private resetEvent(): Event {
    return {
      id: uuidv4(),
      eventName: '',
      image: '',
      date: this.formatDateForInput(new Date().toISOString()), // Initialize with current date
      time: '',
      location: '',
      description: '',
      totalTickets: 0,
    };
  }

  // Method to format date for backend in ISO format (2025-09-15T10:00:00.000Z)
  public formatDateForBackend(date: string): string {
    const formattedDate = new Date(date);
    return formattedDate.toISOString(); // Converts to the correct ISO format
  }

  // Format the date for input as 'YYYY-MM-DD' for frontend display
  public formatDateForInput(isoDate: string): string {
    return isoDate ? isoDate.split('T')[0] : '';
  }

  // Edit and delete methods (same as before)
  editEvent(eventId: string): void {
    console.log('Editing event with ID:', eventId);
    // Logic to edit the event (navigate to edit page, show form, etc.)
  }

  confirmDelete(eventId: string): void {
    console.log('Confirming deletion of event with ID:', eventId);
    // Add your confirmation logic here (e.g., call backend API to delete the event)
  }
}
