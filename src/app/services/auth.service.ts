import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, throwError, of } from "rxjs";
import { timeout, catchError, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";

import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isAuthenticated = false;

  constructor(private router: Router, private http: HttpClient) {}

  userIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  login(username, password): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post(environment.apiURL + "/login", { username, password }, options)
    .pipe(
      tap(response => {
        this.isAuthenticated = true;
        this.goHome();
      }),
      catchError(err => {
        return of({ error: "Failed to login!" });
      })
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.goHome();
  }

  register(username, password): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post(environment.apiURL + "/register", { username, password }, options)
    .pipe(
      catchError(err => {
        return of({ error: "Failed to register!" });
      })
    );
  }

  resetPW(email): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post(environment.apiURL + "/reset", { email }, options)
    .pipe(
      catchError(err => {
        return of({ error: "Failed to request password reset!" });
      })
    )
  }

  goHome(): void {
    this.router.navigateByUrl("/");
  }
}
