import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";

import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class WorkflowService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  options = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Token ${this.cookieService.get("TOKEN")}`,
    }),
  };

  getWorkflows(): Observable<any> {
    this.setHeaders();
    return this.http.get(environment.apiURL + "/workflow/", this.options).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch workflows!` });
      })
    );
  }

  addWorkflow(newWorkflow): Observable<any> {
    this.setHeaders();
    return this.http
      .post(environment.apiURL + "/workflow/", newWorkflow, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to add workflow!` });
        })
      );
  }

  updateWorkflow(updatedWorkflow, id): Observable<any> {
    this.setHeaders();
    return this.http
      .put(
        environment.apiURL + `/workflow/${id}/`,
        updatedWorkflow,
        this.options
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update workflow!` });
        })
      );
  }

  deleteWorkflow(id): Observable<any> {
    this.setHeaders();
    return this.http
      .delete(environment.apiURL + `/workflow/${id}/`, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete workflow!` });
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
