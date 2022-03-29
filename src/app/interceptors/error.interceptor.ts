import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // the auth interceptor handles logout and redirect on 401
    return next.handle(request)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        // handle other errors in here
        return throwError(error);
      })
    );
  }
}