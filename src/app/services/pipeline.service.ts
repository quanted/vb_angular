import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { PipelineModel } from '../models/pipeline.model';
import { PipelineInfoModel } from '../models/pipeline-info.model';

@Injectable({
  providedIn: 'root',
})
export class PipelineService {
  constructor(private http: HttpClient) {}

  getProjectPipelines(id): Observable<any> {
    return this.http.get(`${environment.apiURL}pipeline/?project=${id}`)
    .pipe(
      catchError((err) => {
        console.log(err);
        return of({ error: `Failed to fetch locations!` });
      })
    );
  }

  executePipeline(project, pipelineID): Observable<any> {
    return this.http.post(`${environment.apiURL}pipeline/execute/`,
      {
        project_id: project.id,
        dataset_id: project.dataset,
        pipeline_id: pipelineID
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to fetch locations!` });
      })
    );
  }

  getPipelineStatus(projectID, pipelineID): Observable<any> {
    return this.http.get(`${environment.apiURL}pipeline/status/?project_id=${projectID}&pipeline_id=${pipelineID}`)
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
    return this.http.get<PipelineInfoModel[]>
    (environment.apiURL.replace('api/', '') + `info/pipelines/`)
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
    return this.http.post(environment.apiURL + 'pipeline/', pipeline)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to add pipeline!` });
        })
      );
  }

  updatePipeline(updatedModel, id): Observable<any> {
    return this.http.put(
        environment.apiURL + `pipeline/${id}/`,
        updatedModel
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to update pipeline!` });
        })
      );
  }

  deletePipeline(id): Observable<any> {
    return this.http.delete(environment.apiURL + `pipeline/${id}/`)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of({ error: `Failed to delete analyticalmodel!` });
        })
      );
  }
}
