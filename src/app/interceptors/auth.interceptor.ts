import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable, EMPTY } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    public auth: AuthService,
    private router: Router
    ) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.body?.password) {
      request = request.clone({ setHeaders: { Authorization: `Token ${this.auth.getToken()}` } });
    }
    return next.handle(request)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {
          this.auth.logout();
          this.router.navigateByUrl("");
        }
        return EMPTY;
      })
    );
  }
}