import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AppNotification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private API_BASE_URL = 'http://localhost:3000/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.API_BASE_URL}/${userId}`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.API_BASE_URL}/${notificationId}/read`, {});
  }
}
