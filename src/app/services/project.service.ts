import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {ProjectModel} from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${this.cookieService.get('TOKEN')}`,
    }),
  };

  getProjects(): Observable<any> {
    this.setHeaders();
    return this.http.get(environment.apiURL + 'api/project/', this.options).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch projects!` });
      })
    );
  }

  addProject(project: ProjectModel): Observable<any> {
    this.setHeaders();
    return this.http
      .post(environment.apiURL + 'api/project/', project, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to add project!` });
        })
      );
  }

  updateProject(updatedLocation, id): Observable<any> {
    this.setHeaders();
    return this.http
      .put(
        environment.apiURL + `api/project/${id}/`,
        updatedLocation,
        this.options
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update project!` });
        })
      );
  }

  deleteProject(id): Observable<any> {
    this.setHeaders();
    return this.http
      .delete(environment.apiURL + `api/project/${id}/`, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete project!` });
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
