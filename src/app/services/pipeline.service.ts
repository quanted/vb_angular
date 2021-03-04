import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { PipelineModel } from '../models/pipeline.model';

@Injectable({
  providedIn: 'root',
})
export class PipelineService {
  private ngUnsubscribe = new Subject();

  constructor(private http: HttpClient) {}

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getProjectPipelines(id): Observable<any> {
    return this.http.get(`${environment.apiURL}pipeline/?project=${id}`)
    .pipe(
      takeUntil(this.ngUnsubscribe),
      catchError((err) => {
        return of({ error: `Failed to fetch poject pipelines!` });
      })
    );
  }

  /**
   * Gets the available pipelines.
   * - GET info/pipelines/
   * @returns A list of the available pipelines.
   */
  getPipelines(): Observable<any> {
    return this.http.get(`${environment.infoURL}info/pipelines`)
    .pipe(
      takeUntil(this.ngUnsubscribe),
      catchError((err) => {
        return of({ error: `Failed to fetch pipelines metadata!` });
      })
    )
  }

  executePipeline(project, pipelineID): Observable<any> {
    return this.http.post(`${environment.apiURL}pipeline/execute/`,
      {
        project_id: project.id,
        dataset_id: project.dataset,
        pipeline_id: pipelineID
      })
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
          return of({ error: `Failed to execute pipeline!` });
      })
    );
  }

  getPipelineStatus(projectID, pipelineID): Observable<any> {
    return this.http.get(`${environment.apiURL}pipeline/status/?project_id=${projectID}&pipeline_id=${pipelineID}`)
    .pipe(
      takeUntil(this.ngUnsubscribe),
      catchError((err) => {
        return of({ error: `Failed to fetch pipeline status!` });
      })
    );
  }

  addPipeline(pipeline: PipelineModel): Observable<any> {
    return this.http.post(environment.apiURL + 'pipeline/', pipeline)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
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
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
          return of({ error: `Failed to update pipeline!` });
        })
      );
  }

  deletePipeline(id): Observable<any> {
    return this.http.delete(environment.apiURL + `pipeline/${id}/`)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
          return of({ error: `Failed to delete pipeline!` });
        })
      );
  }
}
