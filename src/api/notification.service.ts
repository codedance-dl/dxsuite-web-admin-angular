import { Injectable } from '@angular/core';

import { DataService } from './data-service';

@Injectable({ providedIn: 'root' })
export class NotificationService extends DataService {
  getAll(
    receiverId: string,
    query?: {
      bizType?: string;
      isRead?: boolean;
      pageNo?: number;
      pageSize?: number;
      senderType?: string;
      sortBy?: [string];
    }
  ) {
    return this.http.get(`/receivers/${receiverId}/notifications` + this.queryParse(query));
  }

  getOne(receiverId: string, notificationId: string) {
    return this.http.get(`/receivers/${receiverId}/notifications/${notificationId}`);
  }

  setRead(receiverId: string, notificationIds: string[]) {
    return this.http.post(`/receivers/${receiverId}/notifications-read`, { notificationIds });
  }

  setUnRead(receiverId: string, notificationId: string) {
    return this.http.post(`/receivers/${receiverId}/notifications/${notificationId}/unread`, {});
  }
}
