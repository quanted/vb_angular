import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class PipelineService implements OnDestroy {
    private ngUnsubscribe = new Subject();

    constructor(private http: HttpClient) {}

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getProjectPipelines(id): Observable<any> {
        return this.http.get(`${environment.apiURL}pipeline/?project=${id}`).pipe(
            switchMap((pipelines) => {
                return of({
                    pipelines: JSON.parse(pipelines[0].metadata.estimators.replaceAll("'", '"')),
                });
            }),
            takeUntil(this.ngUnsubscribe),
            catchError(() => {
                return of({ error: `Failed to fetch project pipelines!` });
            })
        );
    }

    getGlobalOptionValues(id): Observable<any> {
        return this.http.get(`${environment.apiURL}pipeline/?project=${id}`).pipe(
            switchMap((pipelines) => {
                const projectPipelines = pipelines;
                return of({
                    globalOptionValues: JSON.parse(pipelines[0].metadata.parameters.replaceAll("'", '"')),
                });
            }),
            takeUntil(this.ngUnsubscribe),
            catchError(() => {
                return of({ error: `Failed to fetch project.globalOptionValues!` });
            })
        );
    }

    // returns [] of available pipelines and corresponding metadata
    getPipelinesMetadata(): Observable<any> {
        return this.http.get(`${environment.infoURL}info/pipelines`).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError(() => {
                return of({ error: `Failed to fetch pipelines metadata!` });
            })
        );
    }

    executePipeline(project, pipelineID): Observable<any> {
        return this.http
            .post(`${environment.apiURL}pipeline/execute/`, {
                project_id: project.id,
                dataset_id: project.dataset,
                pipeline_id: pipelineID,
            })
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(() => {
                    return of({ error: `Failed to execute pipeline!` });
                })
            );
    }

    getPipelineStatus(projectID, pipelineID): Observable<any> {
        return this.http
            .get(`${environment.apiURL}pipeline/status/?project_id=${projectID}&pipeline_id=${pipelineID}`)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(() => {
                    return of({ error: `Failed to fetch pipeline status!` });
                })
            );
    }

    addPipeline(pipeline: any): Observable<any> {
        return this.http.post(environment.apiURL + "pipeline/", pipeline).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError(() => {
                return of({ error: `Failed to add pipeline!` });
            })
        );
    }

    updatePipeline(updatedPipeline: any): Observable<any> {
        return this.http.put(environment.apiURL + `pipeline/${updatedPipeline.id}/`, updatedPipeline).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError(() => {
                return of({ error: `Failed to update pipeline!` });
            })
        );
    }

    deletePipeline(id): Observable<any> {
        return this.http.delete(environment.apiURL + `pipeline/${id}/`).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError(() => {
                return of({ error: `Failed to delete pipeline!` });
            })
        );
    }
}
