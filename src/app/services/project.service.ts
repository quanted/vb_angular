import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  createProject(project): Observable<any> {
    return this.http.post(environment.apiURL + "project/", project).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to create project!` });
      })
    );
  }

  getProjects(): Observable<any> {
    return this.http.get(environment.apiURL + "project/").pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch projects!` });
      })
    );
  }

  updateProject(update): Observable<any> {
    return this.http.put(`${environment.apiURL}project/${update.id}/`, update).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to update project!` });
      })
    );
  }

  deleteProject(id): Observable<any> {
    return this.http.delete(environment.apiURL + "project/" + id).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to delete project!` });
      })
    );
  }
}
