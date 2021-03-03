import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      filter(event => event instanceof HttpResponse),
      tap((event: HttpResponse<any>) => {
        // console.log("RESPONSE>>> ", event);
      })
    );
  }
}