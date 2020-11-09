import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: "root",
})
export class AnalyticalModelService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}
  
  options = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Token ${this.cookieService.get("TOKEN")}`,
    }),
  };

  getModels(): Observable<any> {
    this.setHeaders();
    return this.http
      .get(environment.apiURL + "analyticalmodel/", this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to fetch analyticalmodels!` });
        })
      );
  }

  addModel(newModel): Observable<any> {
    this.setHeaders();
    return this.http
      .post(environment.apiURL + "analyticalmodel/", newModel, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to add analyticalmodel!` });
        })
      );
  }

  updateModel(updatedModel, id): Observable<any> {
    this.setHeaders();
    return this.http
      .put(
        environment.apiURL + `analyticalmodel/${id}/`,
        updatedModel,
        this.options
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update analyticalmodel!` });
        })
      );
  }

  deleteModel(id): Observable<any> {
    this.setHeaders();
    return this.http
      .delete(environment.apiURL + `analyticalmodel/${id}/`, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete analyticalmodel!` });
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
