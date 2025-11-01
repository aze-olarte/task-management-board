import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private nzNotificationService: NzNotificationService, private http: HttpClient) {}

  showSuccess(bodyMessage: string): void {
    this.nzNotificationService.success('Success', bodyMessage, {
      nzKey: 'key',
      nzDuration: 5000,
    });
  }

  showError(message: string): void {
    this.nzNotificationService.error('Error', message, {
      nzKey: 'key',
      nzDuration: 5000,
    });
  }
}
