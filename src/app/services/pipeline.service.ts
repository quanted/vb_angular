import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, Subject } from "rxjs";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";
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

    // returns [] of available pipelines and corresponding metadata
    getPipelinesMetadata(): Observable<any> {
        return this.http.get(`${environment.infoURL}info/pipelines`).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to fetch pipelines metadata! ${error}` });
            })
        );
    }

    getGlobalOptionsMetadata(): Observable<any> {
        return this.getPipelinesMetadata().pipe(
            switchMap((pipelines) => {
                return of({});
            })
        );
    }

    getAllPipelines(id): Observable<any> {
        return this.http.get(`${environment.apiURL}pipeline/?project=${id}`).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to fetch project pipelines! ${error}` });
            })
        );
    }

    getProjectPipelines(id): Observable<any> {
        return this.getAllPipelines(id).pipe(
            switchMap((pipelines: any[]) => {
                pipelines = pipelines.filter((pipeline) => {
                    return pipeline.type != "vbhelper";
                });

                return of(pipelines);
            }),
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to fetch project pipelines! ${error}` });
            })
        );
    }

    getGlobalOptionsValues(id, defaults): Observable<any> {
        return this.getAllPipelines(id).pipe(
            switchMap((pipelines: any[]) => {
                let vbhelper = null;
                for (let pipeline of pipelines) {
                    if (pipeline.type == "vbhelper") {
                        vbhelper = pipeline;
                    }
                }
                if (!vbhelper) {
                    return this.createVBHelper(id, defaults);
                    // return of({ error: "no vbhelper!" });
                }
                return of(vbhelper);
            }),
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to fetch project.globalOptionValues! ${error}` });
            })
        );
    }

    // returns [] of a project's estimators options values
    getEstimatorsOptionsValues(id): Observable<any> {
        return this.getProjectPipelines(id).pipe(
            switchMap((estimators) => {
                estimators = estimators.filter((pipeline) => {
                    return pipeline.ptype != "vbhelper";
                });

                return of(estimators);
            }),
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to fetch project.globalOptionValues! ${error}` });
            })
        );
    }

    createVBHelper(id, defaults) {
        const pipeline = {
            project: id,
            name: "VB Helper",
            type: "vbhelper",
            description: "Parent pipeline class, containing global CV",
            metadata: JSON.stringify({ parameters: defaults }),
        };
        return this.addPipeline(pipeline);
    }

    addPipeline(pipeline: any): Observable<any> {
        return this.http.post(environment.apiURL + "pipeline/", pipeline).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to add pipeline! ${error}` });
            })
        );
    }

    updatePipeline(updatedPipeline: any): Observable<any> {
        return this.http.put(environment.apiURL + `pipeline/${updatedPipeline.id}/`, updatedPipeline).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to update pipeline! ${error}` });
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
                catchError((error) => {
                    return of({ error: `Failed to execute pipeline! ${error}` });
                })
            );
    }

    getPipelineStatus(projectID, pipelineID): Observable<any> {
        return this.http
            .get(`${environment.apiURL}pipeline/status/?project_id=${projectID}&pipeline_id=${pipelineID}`)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError((error) => {
                    return of({ error: `Failed to fetch pipeline status! ${error}` });
                })
            );
    }

    deletePipeline(id): Observable<any> {
        return this.http.delete(environment.apiURL + `pipeline/${id}/`).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to delete pipeline! ${error}` });
            })
        );
    }
}
