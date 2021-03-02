import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getLocations(): Observable<any> {
    return this.http.get(environment.apiURL + 'location/')
    .pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch locations!` });
      })
    );
  }

  addLocation(newLocation): Observable<any> {
    return this.http.post(environment.apiURL + 'location/', newLocation)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to add location!` });
        })
      );
  }

  updateLocation(updatedLocation, id): Observable<any> {
    return this.http.put(
        environment.apiURL + `location/${id}/`,
        updatedLocation
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update location!` });
        })
      );
  }

  deleteLocation(id): Observable<any> {
    return this.http.delete(environment.apiURL + `location/${id}/`)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete location!` });
        })
      );
  }
}
