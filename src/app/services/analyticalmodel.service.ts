import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { CookieService } from 'ngx-cookie-service';
import { AnalyticalModelResponse } from '../models/analytical-model-response';

@Injectable({
  providedIn: "root",
})
export class AnalyticalModelService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}
  
  options = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Token ${this.cookieService.get("TOKEN")}`
    }),
  };

  getModels(projectID : string): Observable<AnalyticalModelResponse[]> {
    this.setHeaders();
    return this.http.post<AnalyticalModelResponse[]>
    (environment.apiURL + `analyticalmodel/${projectID}/`, this.options)
    .pipe(
      catchError(this.handleError<AnalyticalModelResponse[]>('getModels', []))
    );
  }


private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(error);
    return of(result as T);
  };
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
      "Content-Type" : "application/json",
      "Authorization" : `Token ${this.cookieService.get("TOKEN")}`
    });
  }
}
