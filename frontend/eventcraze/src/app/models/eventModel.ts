export interface EventModel {
    id: string;
    eventName: string;
    date: Date;
    time: string;
    location: string;
    description: string;
    image: string;
    totalTickets: number;
    tickets: Ticket[];
    bookings: Booking[];
    reviews: Review[];
    notifications: Notification[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Ticket {
    id: string;
    type: string;
    price: number;
    eventId: string;
  }
  
  export interface Booking {
    id: string;
    userId: string;
    eventId: string;
    ticketId: string;
    quantity: number;
    createdAt: Date;
  }
  
  export interface Review {
    id: string;
    userId: string;
    eventId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }
  
  export interface Notification {
    id: string;
    userId: string;
    eventId: string;
    message: string;
    createdAt: Date;
  }
  