import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  dataSet = [];

  constructor(private http: HttpClient) {}
  
  getDataset(dataset_id): Observable<any> {
    return this.http.get(`${environment.apiURL}dataset/${dataset_id}`).pipe(
      catchError((err) => {
        return of({ error: `Failed to fetch dataset id=${dataset_id}!\n`, err });
      })
    );;
  }

  getDatasets(): Observable<any> {
    return this.http.get(environment.apiURL + 'dataset/').pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch datasets!` });
      })
    );
  }

  createDataset(newDataset): Observable<any> {
    return this.http.post(environment.apiURL + 'dataset/', newDataset)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to add dataset!` });
        })
      );
  }

  updateDataset(updatedDataset, id): Observable<any> {
    return this.http.put(environment.apiURL + `dataset/${id}/`, updatedDataset)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update dataset!` });
        })
      );
  }

  deleteDataset(dataset): Observable<any> {
    return this.http.delete(environment.apiURL + `dataset/${dataset.id}/`)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete dataset!` });
        })
      );
  }
}
