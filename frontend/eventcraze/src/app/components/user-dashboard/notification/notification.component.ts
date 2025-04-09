import { Component } from '@angular/core';
import { AppNotification, NotificationService } from '../../../services/notificationService';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth.service';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  userId: string = ''; 
  notifications: AppNotification[] = [];

  constructor(private notificationService: NotificationService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId() ?? ''; 
    console.log('User ID:', this.userId); 
    if (!this.userId) {
      console.error('User ID is missing. Redirecting to login...');
      return;
    }
    this.notificationService.getNotifications(this.userId).subscribe(
      (notifications: AppNotification[]) => {
        this.notifications = notifications;
      },
      (error: any) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }
  // markAsRead(notificationId: string): void {
  //   this.notificationService.markAsRead(notificationId).subscribe(
  //     () => {
  //       // Optionally update the local state without a full re-fetch,
  //       // but for now, we re-fetch to update our list.
  //       this.fetchNotifications();
  //     },
  //     (error: any) => {
  //       console.error('Error marking notification as read:', error);
  //     }
  //   );
  // }
}
