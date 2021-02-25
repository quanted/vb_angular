import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form',
      Authorization: `Token ${this.cookieService.get('TOKEN')}`,
    }),
  };

  getLocation(location_id): Observable<any> {
    this.setHeaders();
    return this.http.get(`${environment.apiURL}location/`, this.options).pipe(
      tap((locations) => {
        console.log('location_id: ', location_id);
        console.log('locations: ', locations);
      }),
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch locations!` });
      })
    );;
  }

  getLocations(): Observable<any> {
    this.setHeaders();
    return this.http.get(environment.apiURL + 'location/', this.options).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch locations!` });
      })
    );
  }

  addLocation(newLocation): Observable<any> {
    this.setHeaders();
    return this.http
      .post(environment.apiURL + 'location/', newLocation, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to add location!` });
        })
      );
  }

  updateLocation(updatedLocation, id): Observable<any> {
    this.setHeaders();
    return this.http
      .put(
        environment.apiURL + `location/${id}/`,
        updatedLocation,
        this.options
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update location!` });
        })
      );
  }

  deleteLocation(id): Observable<any> {
    this.setHeaders();
    return this.http
      .delete(environment.apiURL + `location/${id}/`, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete location!` });
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
