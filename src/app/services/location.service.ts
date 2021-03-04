import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private ngUnsubscribe = new Subject();
  constructor(private http: HttpClient) {}

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getLocations(): Observable<any> {
    return this.http.get(environment.apiURL + 'location/')
    .pipe(
      takeUntil(this.ngUnsubscribe),
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch locations!` });
      })
    );
  }

  addLocation(newLocation): Observable<any> {
    return this.http.post(environment.apiURL + 'location/', newLocation)
      .pipe(
        takeUntil(this.ngUnsubscribe),
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
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update location!` });
        })
      );
  }

  deleteLocation(id): Observable<any> {
    return this.http.delete(environment.apiURL + `location/${id}/`)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete location!` });
        })
      );
  }
}
