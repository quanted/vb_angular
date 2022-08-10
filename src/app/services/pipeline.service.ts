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

    getAllPipelines(id): Observable<any> {
        return this.http.get(`${environment.apiURL}pipeline/?project=${id}`).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to fetch project pipelines! ${error}` });
            })
        );
    }

    // this returns all a project's pipelines except the vbhelper one
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

    // this returns a projects vbhelper pipeline only
    // and will create one for a project if it doesn't have one already
    getProjectVBHelperPipeline(id, defaults): Observable<any> {
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
                }
                return of(vbhelper);
            }),
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to fetch project.globalOptionValues! ${error}` });
            })
        );
    }

    addPipeline(pipeline: any): Observable<any> {
        pipeline.metadata = this.prepareMetadata(pipeline.metadata);
        console.log("addPipeline: ", pipeline);
        return this.http.post(environment.apiURL + "pipeline/", pipeline).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
                return of({ error: `Failed to add pipeline! ${error}` });
            })
        );
    }

    // creates a vbhelper pipeline which contains the project global options
    // every project requires a vbhelper pipeline
    createVBHelper(id, defaults) {
        const pipeline = {
            project: id,
            name: "VB Helper",
            type: "vbhelper",
            description: "Parent pipeline class, containing global CV",
            metadata: { parameters: defaults },
        };
        return this.addPipeline(pipeline);
    }

    // updates an existing pipeline
    updatePipeline(pipeline): Observable<any> {
        pipeline.metadata = this.prepareMetadata(pipeline.metadata);
        return this.http.put(environment.apiURL + `pipeline/${pipeline.id}/`, pipeline).pipe(
            takeUntil(this.ngUnsubscribe),
            tap((response) => {
                console.log("updatePipeline.response: ", response);
            }),
            catchError((error) => {
                return of({ error: `Failed to update pipeline! ${error}` });
            })
        );
    }

    // returns a valid json string
    prepareMetadata(metadata): string {
        /**
         *  vbHelper metadata:
         *  metadata = {
                parameters: {
                    hyper_param_1: value,
                    hyper_param_2: value,
                    hyper_param_3: value,
                    hyper_param_4: value, ...
                },
                estimators: [],
                outer_cv: "True",
                drop_features: [],
            }
            other pipeline metadata:
            metadata = {
                hyper_param_1: value,
                hyper_param_2: value,
                hyper_param_3: value,
                hyper_param_4: value, ...
            }
         */
        // the incoming metadata object is raw angular form data
        // numbers could be represented as strings in that data
        // need to convert them to numbers before sending to backend
        let newMetadata = {};
        newMetadata["parameters"] = {};
        if (Object.keys(metadata).includes("parameters")) {
            for (let field of Object.keys(metadata["parameters"])) {
                const newFloat = parseFloat(metadata["parameters"][field]);
                if (newFloat || newFloat === 0) {
                    newMetadata["parameters"][field] = newFloat;
                } else {
                    newMetadata["parameters"][field] = metadata["parameters"][field];
                }
            }
            if (metadata.estimators) newMetadata["estimators"] = metadata.estimators;
            if (metadata.outer_cv) newMetadata["outer_cv"] = metadata.outer_cv;
            if (metadata.drop_features) newMetadata["drop_features"] = metadata.drop_features;
        } else {
            for (let field of Object.keys(metadata)) {
                const newFloat = parseFloat(metadata[field]);
                if (newFloat) {
                    newMetadata["parameters"][field] = newFloat;
                } else {
                    newMetadata["parameters"][field] = metadata[field];
                }
            }
        }
        console.log("preparedMetadata: ", newMetadata);
        return JSON.stringify(newMetadata);
    }

    executePipeline(project, pipeline_id): Observable<any> {
        return this.http
            .post(`${environment.apiURL}pipeline/execute/`, {
                project_id: project.id,
                dataset_id: project.dataset,
                pipeline_id: pipeline_id,
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
