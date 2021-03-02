import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse, JsonpClientBackend } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (!request.body?.password) {
      request = request.clone({ setHeaders: { Authorization: `Token ${this.auth.getToken()}` } });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
              // console.log('event--->>>', event);
          }
          return event;
      }));
  }
}