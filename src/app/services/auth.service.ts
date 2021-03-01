import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError, of } from 'rxjs';
import { timeout, catchError, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { RegistrationResponse } from '../models/registration-response';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  userIsAuthenticated(): boolean {
    return ((this.cookieService.check("TOKEN") && (this.cookieService.check("USERNAME")));
  }

  login(username, password): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .post(environment.apiURL + 'user/login/', { username, password }, options)
      .pipe(
        tap((response: LoginResponse) => {
          this.cookieService.set('TOKEN', response.token);
          this.cookieService.set('USERNAME', response.username);
          this.goHome();
        }),
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to login!` });
        })
      );
  }

  logout(): void {
    this.cookieService.deleteAll();
    this.goHome();
  }

  register(username, email, password): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const newUser = {
      username,
      email,
      password,
    };
    return this.http
      .post(environment.apiURL + 'user/register/', newUser, options)
      .pipe(
        tap((response: RegistrationResponse) => {
          this.cookieService.set('TOKEN', response.token);
          this.cookieService.set('USERNAME', response.username);
          this.goHome();
        }),
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to register!` });
        })
      );
  }

  resetPW(email): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .post(environment.apiURL + 'user/reset', { email }, options)
      .pipe(
        catchError((err) => {
          return of({ error: 'Failed to request password reset!' });
        })
      );
  }

  getUsername() {
    return this.cookieService.get('USERNAME');
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }
}
