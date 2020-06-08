import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, throwError, of } from "rxjs";
import { timeout, catchError, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";

import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isAuthenticated = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  userIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  login(username, password): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .post(
        environment.apiURL + "api/user/login/",
        { username, password },
        options
      )
      .pipe(
        tap((response) => {
          this.isAuthenticated = true;
          this.cookieService.set("TOKEN", response["token"]);
          this.cookieService.set("USERNAME", response["username"]);
          this.goHome();
        }),
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to login!` });
        })
      );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.cookieService.set("TOKEN", null);
    this.cookieService.set("USERNAME", null);
    this.goHome();
  }

  register(username, email, password): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    const newUser = {
      username,
      email,
      password,
    };
    return this.http
      .post(environment.apiURL + "api/user/register/", newUser, options)
      .pipe(
        tap((response) => {
          this.isAuthenticated = true;
          this.cookieService.set("TOKEN", response["token"]);
          this.cookieService.set("USERNAME", response["username"]);
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
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .post(environment.apiURL + "api/user/reset", { email }, options)
      .pipe(
        catchError((err) => {
          return of({ error: "Failed to request password reset!" });
        })
      );
  }

  goHome(): void {
    this.router.navigateByUrl("/");
  }
}
