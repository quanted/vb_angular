import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";

import { Observable, of, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private ngUnsubscribe = new Subject();

  constructor(private http: HttpClient) {}

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createProject(project): Observable<any> {
    return this.http.post(environment.apiURL + "project/", project)
    .pipe(
      takeUntil(this.ngUnsubscribe),
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to create project!` });
      })
    );
  }

  getProjects(): Observable<any> {
    return this.http.get(environment.apiURL + "project/")
    .pipe(
      takeUntil(this.ngUnsubscribe),
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch projects!` });
      })
    );
  }

  updateProject(update): Observable<any> {
    return this.http.put(`${environment.apiURL}project/${update.id}/`, update)
    .pipe(
      takeUntil(this.ngUnsubscribe),
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to update project!` });
      })
    );
  }

  deleteProject(id): Observable<any> {
    return this.http.delete(environment.apiURL + "project/" + id)
    .pipe(
      takeUntil(this.ngUnsubscribe),
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to delete project!` });
      })
    );
  }
}
