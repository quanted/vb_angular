import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, of, Subject } from "rxjs";
import { catchError, tap, takeUntil } from "rxjs/operators";

import { environment } from "../../../environments/environment";

import { HttpClient } from "@angular/common/http";

import { CookieService } from "ngx-cookie-service";

import { RegistrationResponse } from "../../models/registration-response";
import { LoginResponse } from "../../models/login-response";

@Injectable({
    providedIn: "root",
})
export class AuthService implements OnDestroy {
    private ngUnsubscribe = new Subject<boolean>();

    constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {}

    ngOnDestroy() {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

    userIsAuthenticated(): boolean {
        return this.cookieService.check("TOKEN") && this.cookieService.check("USERNAME");
    }

    getToken() {
        return this.cookieService.get("TOKEN");
    }

    login(username, password): Observable<any> {
        return this.http.post(environment.apiURL + "user/login/", { username, password }).pipe(
            takeUntil(this.ngUnsubscribe),
            tap((response: LoginResponse) => {
                this.cookieService.set("TOKEN", response.token);
                this.cookieService.set("USERNAME", response.username);
                this.router.navigateByUrl("home");
            }),
            catchError((error) => {
                return of({ error });
            })
        );
    }

    logout(): void {
        this.cookieService.deleteAll();
        this.router.navigateByUrl("");
    }

    register(username, email, password): Observable<any> {
        const newUser = {
            username,
            email,
            password,
        };
        return this.http.post(environment.apiURL + "user/register/", newUser).pipe(
            takeUntil(this.ngUnsubscribe),
            tap((response: RegistrationResponse) => {
                this.cookieService.set("TOKEN", response.token);
                this.cookieService.set("USERNAME", response.username);
                this.router.navigateByUrl("home");
            }),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to register!` });
            })
        );
    }

    resetPW(email): Observable<any> {
        return this.http.post(environment.apiURL + "user/reset", { email }).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                return of({ error: "Failed to request password reset!" });
            })
        );
    }

    getUsername() {
        return this.cookieService.get("USERNAME");
    }
}
