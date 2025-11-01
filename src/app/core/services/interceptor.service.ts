import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';

export const interceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let msg = '';
      switch (error.status) {
        case 401:
          msg = 'Unauthorized access.';
          break;
        case 404:
          msg = 'Requested resource not found.';
          break;
        default:
          msg = `Error ${error.status}: ${error.message}`;
      }
      notificationService.showError(msg)
      return throwError(() => error);
    })
  );
};