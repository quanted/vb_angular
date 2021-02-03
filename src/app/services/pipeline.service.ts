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
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // Http Options to append to requests.
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${this.cookieService.get('TOKEN')}`
    }),
  };

  /**
   * Gets the available pipelines.
   * - GET info/pipelines/
   * @returns A list of the available pipelines.
   */
  getPipelines(): Observable<PipelineInfoModel[]> {
    this.setHeaders();
    return this.http.get<PipelineInfoModel[]>
    (environment.apiURL + `info/pipelines/`, this.options)
    .pipe(
      catchError(this.handleError<PipelineInfoModel[]>('getPipelines', []))
    );
  }

  /**
   * Gets a list of pipeline for the given project ID.
   * - GET api/pipeline/?project=ID
   * @param projectID
   * @returns A list of pipelines.
   */
  getPipelinesForProject(projectID: string): Observable<PipelineModel[]> {
    this.setHeaders();
    const newOptions = this.options;
    newOptions.headers.append('project', projectID);
    const param = new HttpParams().set('project', projectID);
    return this.http.get<PipelineModel[]>
    (environment.apiURL + `api/pipeline/`, {headers: this.options.headers, params: param})
      .pipe(
        catchError(this.handleError<PipelineModel[]>('getPipelinesForProject', []))
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
      .post(environment.apiURL + 'api/pipeline/', pipeline, this.options)
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
        environment.apiURL + `api/pipeline/${id}/`,
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

  deleteModel(id): Observable<any> {
    this.setHeaders();
    return this.http
      .delete(environment.apiURL + `api/pipeline/${id}/`, this.options)
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
