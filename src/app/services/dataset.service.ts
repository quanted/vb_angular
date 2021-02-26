import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  dataSet = [];

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${this.cookieService.get('TOKEN')}`,
    }),
  };
  
  getDataset(dataset_id): Observable<any> {
    this.setHeaders();
    return this.http.get(`${environment.apiURL}dataset/${dataset_id}`, this.options).pipe(
      catchError((err) => {
        return of({ error: `Failed to fetch dataset id=${dataset_id}!\n`, err });
      })
    );;
  }

  getDatasets(): Observable<any> {
    this.setHeaders();
    return this.http.get(environment.apiURL + 'dataset/', this.options).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch datasets!` });
      })
    );
  }

  createDataset(newDataset): Observable<any> {
    this.setHeaders();
    return this.http
      .post(environment.apiURL + 'dataset/', newDataset, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to add dataset!` });
        })
      );
  }

  updateDataset(updatedDataset, id): Observable<any> {
    this.setHeaders();
    return this.http
      .put(environment.apiURL + `dataset/${id}/`, updatedDataset, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update dataset!` });
        })
      );
  }

  deleteDataset(dataset): Observable<any> {
    this.setHeaders();
    return this.http
      .delete(environment.apiURL + `dataset/${dataset.id}/`, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete dataset!` });
        })
      );
  }

  setHeaders(): void {
    this.options.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${this.cookieService.get('TOKEN')}`,
    });
  }
}
