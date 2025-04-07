import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../services/eventService';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { TicketService } from '../../../services/ticketService';

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

interface Ticket {
  type: string;
  price: number;
  quantity: number;
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
  newTicket: Ticket = { type: '', price: 0, quantity: 0 };
  showTicketForm: boolean = false;

  showCreateForm: boolean = false;

    // For deletion confirmation popup
    showDeleteConfirm: boolean = false;
    eventIdToDelete: string | null = null;

     // For displaying success messages
  successMessage: string = '';

  constructor(private eventService: EventService,  private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  // Fetch events from the backend using the event service
  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data: Event[]) => {
        this.events = data;
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }

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
            this.showCreateForm = false;
            this.showTicketForm = true; // 👈 Show ticket form after event creation
            // Close the form after creation
            this.newTicket = { type: '', price: 0, quantity: 0 }; // Reset ticket form
            setTimeout(() => (this.successMessage = ''), 3000);
            this.successMessage = 'Event created successfully!';
            this.loadEvents(); // Reload events after creation
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

  createTicket(): void {
    const ticketData = {
      eventId: this.newEvent.id,
      type: this.newTicket.type,
      price: this.newTicket.price,
      quantity: this.newTicket.quantity
    };

    this.ticketService.createTicket(ticketData).subscribe({
      next: (res: any) => {
        this.successMessage = 'Ticket created successfully!';
        this.showTicketForm = true;
        this.newTicket = {type: '', price: 0, quantity: 0 };
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err: any) => {
        console.error('Error creating ticket:', err);
      }
    });
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

 // Instead of using alert(), use a custom confirmation popup
 promptDelete(eventId: string): void {
  this.eventIdToDelete = eventId;
  this.showDeleteConfirm = true;
}

// Called when the user confirms deletion in the popup
deleteConfirmed(): void {
  if (this.eventIdToDelete) {
    this.eventService.deleteEvent(this.eventIdToDelete).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.id !== this.eventIdToDelete);
        this.displaySuccess("Event deleted successfully");
        this.showDeleteConfirm = false;
        this.eventIdToDelete = null;
      },
      error: error => {
        console.error('Error deleting event:', error);
      }
    });
  }
}

// Cancel deletion popup
cancelDeleteConfirmation(): void {
  this.showDeleteConfirm = false;
  this.eventIdToDelete = null;
}

// Display a success message for 3 seconds
displaySuccess(message: string): void {
  this.successMessage = message;
  setTimeout(() => {
    this.successMessage = '';
  }, 3000);
}
}
