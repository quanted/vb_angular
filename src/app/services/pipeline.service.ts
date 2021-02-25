import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { PipelineModel } from '../models/pipeline.model';
import { PipelineInfoModel } from '../models/pipeline-info.model';

@Injectable({
  providedIn: 'root',
})
export class PipelineService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
    ) {}

  // Http Options to append to requests.
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${this.cookieService.get('TOKEN')}`
    }),
  };

  getProjectPipelines(id): Observable<any> {
    this.setHeaders();
    return this.http.get(`${environment.apiURL}pipeline/?project=${id}`, this.options).pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch locations!` });
      })
    );
  }

  executePipeline(project, pipelineID): Observable<any> {
    this.setHeaders();
    return this.http.post(`${environment.apiURL}pipeline/execute/`,
      {
        project_id: project.id,
        dataset_id: project.dataset,
        pipeline_id: pipelineID
      },
      this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to fetch locations!` });
        })
      );
  }

  getPipelineStatus(projectID, pipelineID): Observable<any> {
    this.setHeaders();
    return this.http
    .get(`${environment.apiURL}pipeline/status/?project_id=${projectID}&pipeline_id=${pipelineID}`,
    this.options)
    .pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch locations!` });
      })
    );
  }

  /**
   * Gets the available pipelines.
   * - GET info/pipelines/
   * @returns A list of the available pipelines.
   */
  getPipelines(): Observable<PipelineInfoModel[]> {
    this.setHeaders();
    return this.http.get<PipelineInfoModel[]>
    (environment.apiURL.replace('api/', '') + `info/pipelines/`, this.options)
    .pipe(
      catchError(this.handleError<PipelineInfoModel[]>('getPipelines', []))
    );
  }

  /**
   * Generic error handler for http requests.
   * @param operation - string literal usually of the offending function.
   * @param result
   * @private
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    };
  }

  addPipeline(pipeline: PipelineModel): Observable<any> {
    this.setHeaders();
    return this.http
      .post(environment.apiURL + 'pipeline/', pipeline, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to add pipeline!` });
        })
      );
  }

  updatePipeline(updatedModel, id): Observable<any> {
    this.setHeaders();
    return this.http
      .put(
        environment.apiURL + `pipeline/${id}/`,
        updatedModel,
        this.options
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update pipeline!` });
        })
      );
  }

  deletePipeline(id): Observable<any> {
    this.setHeaders();
    return this.http
      .delete(environment.apiURL + `pipeline/${id}/`, this.options)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete analyticalmodel!` });
        })
      );
  }

  setHeaders(): void {
    this.options.headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      Authorization : `Token ${this.cookieService.get('TOKEN')}`
    });
  }
}
