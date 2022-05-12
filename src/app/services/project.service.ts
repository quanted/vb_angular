import { Injectable, OnDestroy } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { EMPTY, forkJoin, Observable, of, Subject, throwError } from "rxjs";
import { catchError, concatMap, switchMap, takeUntil, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { deepCopy } from "../utils/deepCopy";

import { PipelineService } from "./pipeline.service";

@Injectable({
    providedIn: "root",
})
export class ProjectService implements OnDestroy {
    private ngUnsubscribe = new Subject();

    constructor(private http: HttpClient, private pipelineService: PipelineService) {
        this.getProjects().subscribe();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getProjects(): Observable<any> {
        return this.http.get(environment.apiURL + "project/").pipe(
            tap((projects: any) => {
                if (projects.error) {
                    throwError({ error: projects.error });
                    return;
                }
            }),
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to fetch projects!` });
            })
        );
    }

    getProject(id): Observable<any> {
        return this.getProjects().pipe(
            switchMap((projects) => {
                for (let project of projects) {
                    if (project.id == id) {
                        return of(project);
                    }
                }
                return EMPTY;
            })
        );
    }

    createProject(project): Observable<any> {
        return this.http.post(environment.apiURL + "project/", project).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to create project!` });
            })
        );
    }

    cloneProject(oldProject): Observable<any> {
        let newProject = deepCopy.Copy(oldProject);
        newProject.name = oldProject.name + " - Copy";
        return this.createProject(newProject).pipe(
            // after getting the newProject update the local reference
            // and get the old project's pipelines to copy
            concatMap((project) => {
                newProject = project;
                return this.pipelineService.getProjectPipelines(oldProject.id);
            }),
            // now update the pipelines with the newProject's id,
            // remove the pipeline id field as the endpoint doesn't want it,
            // fix the metadata json string,
            // join all those requests together into one observable
            concatMap((pipelines) => {
                const newPipelines = [];
                for (let pipeline of pipelines) {
                    pipeline.project = newProject.id;
                    delete pipeline.id;
                    // TODO: this is because of backend inconsistencies
                    // changing metadata: parameters: "{'do_prep': 'True',...
                    // to metadata: parameters: "{"do_prep": "True",...
                    // to metadata: parameters: {do_prep: 'True',...
                    pipeline.metadata.parameters = JSON.parse(pipeline.metadata.parameters.replaceAll("'", '"'));
                    // to metadata: "{\"parameters\":{\"do_prep\":\"True\",...
                    pipeline.metadata = JSON.stringify(pipeline.metadata.parameters);
                    newPipelines.push(this.pipelineService.addPipeline(pipeline));
                }
                return forkJoin(newPipelines);
            }),
            // now that the project's pipelines are ready
            // return the new project
            switchMap((response) => {
                return of({ ...newProject });
            })
        );
    }

    updateProjectMetadata(project, metadata): Observable<any> {
        const updatedProject = deepCopy.Copy(project);
        updatedProject.name = metadata.name;
        updatedProject.description = metadata.description;
        return this.updateProject(updatedProject);
    }

    selectLocation(project, location): Observable<any> {
        if (location) {
            project.location = location.id;
        } else {
            project.location = null;
        }
        return this.updateProject(project);
    }

    selectDataset(project, dataset): Observable<any> {
        if (dataset) {
            project.dataset = dataset.id;
            project["metadata"] = JSON.stringify({ ...dataset.metadata });
        } else {
            project.dataset = null;
            project["metadata"] = null;
        }
        return this.updateProject(project);
    }

    updateProject(project): Observable<any> {
        return this.http.put(`${environment.apiURL}project/${project.id}/`, project).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to update project!` });
            })
        );
    }

    executeProject(project): Observable<any> {
        return this.pipelineService.getAllPipelines(project.id).pipe(
            concatMap((pipelines) => {
                let vbHelper = null;
                let estimators = [];
                for (let pipeline of pipelines) {
                    if (pipeline.type == "vbhelper") {
                        vbHelper = pipeline;
                    } else {
                        let estimator = {
                            type: pipeline.type,
                            parameters: pipeline.metadata.parameters,
                        };
                        estimators.push(estimator);
                    }
                }
                let parameters = vbHelper.metadata.parameters;

                const metadata = {
                    parameters,
                    estimators,
                    outer_cv: "True",
                    drop_features: [],
                };
                return this.pipelineService.updatePipeline(vbHelper, metadata);
            }),
            concatMap((vbHelper) => {
                return this.pipelineService.executePipeline(project, vbHelper.id);
            })
        );
    }

    isExecutionReady(project): Observable<boolean> {
        return this.pipelineService.getProjectPipelines(project.id).pipe(
            switchMap((pipelines) => {
                if (project && project.location && project.dataset && pipelines.length > 0) {
                    return of(true);
                }
                return of(false);
            })
        );
    }

    deleteProject(project): Observable<any> {
        return this.http.delete(environment.apiURL + "project/" + project.id + "/").pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to delete project ${project.name}!` });
            })
        );
    }
}
