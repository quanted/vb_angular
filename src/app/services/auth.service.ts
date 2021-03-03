import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';

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

  ngOnInit() {
  }

  userIsAuthenticated(): boolean {
    return (this.cookieService.check('TOKEN') && this.cookieService.check('USERNAME'));
  }

  getToken() {
    return this.cookieService.get('TOKEN');
  }

  login(username, password): Observable<any> {
    return this.http
      .post(environment.apiURL + 'user/login/', { username, password })
      .pipe(
        tap((response: LoginResponse) => {
          this.cookieService.set('TOKEN', response.token);
          this.cookieService.set('USERNAME', response.username);
          this.goHome();
        }),
        catchError((error) => {
          return of({ error });
        })
      );
  }

  logout(): void {
    this.cookieService.deleteAll();
    this.goHome();
  }

  register(username, email, password): Observable<any> {
    const newUser = {
      username,
      email,
      password,
    };
    return this.http
      .post(environment.apiURL + 'user/register/', newUser)
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
    return this.http
      .post(environment.apiURL + 'user/reset', { email })
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
    this.router.navigateByUrl('home');
  }
}
