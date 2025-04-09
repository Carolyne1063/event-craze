import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { BookingService } from '../../../services/bookingService';
import { EventService } from '../../../services/eventService';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent {
  bookings: any[] = []; 
  selectedBooking: any = null;
  cancelBookingId: string | null = null; 
  showUpdateForm = false;
  showRefundMessage = false;
  showCancelConfirmation!: boolean;
  userId: string = ''; 
  showSuccessMessage = false;
  showErrorMessage = false;
  ticketTypes: string[] = []; 

  constructor(private bookingService: BookingService, private authService: AuthService, private eventService: EventService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId() ?? ''; 
    console.log('User ID:', this.userId); 
    if (!this.userId) {
      console.error('User ID is missing. Redirecting to login...');
      return;
    }
    this.fetchBookings();
  }

  fetchBookings() {
    this.bookingService.getUserBookings(this.userId).subscribe(
      (data: any[]) => {
        console.log('Fetched Bookings:', data); 
        this.bookings = data.map(booking => ({ 
          ...booking, 
          eventName: '',  
          image: '',
          date: '',
          time: '',
          ticketType: booking.ticketType,
          quantity: booking.quantity,
          price: 0 
        }));
  
        this.bookings.forEach(booking => {
          console.log('Fetching event details for eventId:', booking.eventId); 
          this.eventService.getEventById(booking.eventId).subscribe(
            (eventData) => {
              console.log('Event Data:', eventData); 
              booking.eventName = eventData.eventName;    
              booking.image = eventData.image;      
              booking.date = eventData.date;        
              booking.time = eventData.time;        
  
              // Populate available ticket types dynamically
              this.ticketTypes = eventData.tickets.map((ticket: any) => ticket.type);
  
              // 🔍 Find the price for the correct ticket type from event details
              const ticketDetails = eventData.tickets.find((ticket: any) => ticket.type === booking.ticketType);
              if (ticketDetails) {
                booking.price = ticketDetails.price; // Set correct price
              }
            },
            (error) => {
              console.error(`Error fetching event details for event ID ${booking.eventId}:`, error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }
  
  openUpdateForm(booking: any) {
    this.selectedBooking = { ...booking };
    this.showUpdateForm = true;
  }

  updateBooking() {
    if (!this.selectedBooking || !this.selectedBooking.id) {
      console.error('No booking selected for update.');
      return;
    }
  
    console.log('Updating booking with ID:', this.selectedBooking.id);
    
    this.bookingService.updateBooking(this.selectedBooking.id, this.selectedBooking.quantity, this.selectedBooking.ticketType).subscribe(
      () => {
        this.fetchBookings(); 
        this.showUpdateForm = false;
        this.showSuccessMessage = true;
        setTimeout(() => this.showSuccessMessage = false, 3000);
      },
      (error) => {
        console.error('Error updating booking:', error);
        this.showErrorMessage = true;
        setTimeout(() => this.showErrorMessage = false, 3000);
      }
    );
  }  

  cancelUpdate() {
    this.showUpdateForm = false;
    this.selectedBooking = null;
  }

  openCancelForm(id: string) { 
    this.cancelBookingId = id;
    this.showCancelConfirmation = true;
  }

  confirmCancelBooking() {
    if (!this.cancelBookingId) return;

    this.bookingService.cancelBooking(this.cancelBookingId).subscribe( 
      () => {
        this.fetchBookings();
        this.cancelBookingId = null;
        this.showCancelConfirmation = false;
        this.showRefundMessage = true;
        setTimeout(() => this.showRefundMessage = false, 3000);
      },
      (error) => {
        console.error('Error cancelling booking:', error);
      }
    );
  }

  cancelCancelBooking() {
    this.cancelBookingId = null;
    this.showCancelConfirmation = false;
  }

  closeRefundMessage() {
    this.showRefundMessage = false;
  }
}