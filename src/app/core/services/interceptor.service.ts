import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const interceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let msg = '';
      switch (error.status) {
        case 400:
          msg = 'Your request could not be processed to due to validation errors.'
          break;
        case 401:
          msg = 'Unauthorized access.';
          break;
        case 403:
          msg = 'You are not not authorized to perform this action.';
          break;
        case 404:
          msg = 'Requested resource not found.';
          break;
        default:
          msg = `An unexpected error occurred. Please refresh the page or try again shortly.`;
      }

      return throwError(() => msg);
    })
  );
};