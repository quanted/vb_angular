import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";

import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects;

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService
    ) {}

  options = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Token ${this.cookieService.get("TOKEN")}`,
    }),
  };

  createProject(project): Observable<any> {
    this.setHeaders();
    return this.http.post(environment.apiURL + "project/", project, this.options).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to create project!` });
      })
    );
  }

  getProjects(): Observable<any> {
    this.setHeaders();
    return this.http.get(environment.apiURL + "project/", this.options).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch locations!` });
      })
    );
  }

  deleteProject(id): Observable<any> {
    this.setHeaders();
    return this.http.delete(environment.apiURL + "project/" + id, this.options).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch locations!` });
      })
    );
  }

  setHeaders(): void {
    this.options.headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Token ${this.cookieService.get("TOKEN")}`,
    });
  }
}
