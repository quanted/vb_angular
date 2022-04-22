import { Injectable, OnDestroy } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, EMPTY, forkJoin, Observable, of, Subject, throwError } from "rxjs";
import { catchError, concatMap, switchMap, takeUntil, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { deepCopy } from "../utils/deepCopy";

import { Metadata } from "../models/metadata.model";

import { PipelineService } from "./pipeline.service";

@Injectable({
    providedIn: "root",
})
export class ProjectService implements OnDestroy {
    private ngUnsubscribe = new Subject();
    private projectSubject: BehaviorSubject<any>;

    private projects: any[] = [];
    private project;

    constructor(private http: HttpClient, private pipelineService: PipelineService) {
        this.getProjects().subscribe();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    monitorProject(): BehaviorSubject<any> {
        return this.projectSubject;
    }

    getProjects(): Observable<any> {
        return this.http.get(environment.apiURL + "project/").pipe(
            tap((projects: any) => {
                if (projects.error) {
                    throwError({ error: projects.error });
                    return;
                }
                this.projects = projects;
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
            tap((project) => {
                this.project = project;
                this.projects.push(project);
            }),
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

    updateProjectMetadata(project, metadata: Metadata): Observable<any> {
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
        } else {
            project.dataset = null;
        }
        return this.updateProject(project);
    }

    updateProject(update): Observable<any> {
        return this.http.put(`${environment.apiURL}project/${update.id}/`, update).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to update project!` });
            })
        );
    }

    executeProject(project): Observable<any> {
        if (this.isExecutionReady()) {
            const pipelineExecutionObservables: any[] = [];
            for (let pipeline of project.pipelines) {
                console.log(`project ${project.id} executing ${pipeline.name} pipeline on dataset ${project.dataset}`);
                pipelineExecutionObservables.push(this.pipelineService.executePipeline(project, pipeline.id));
            }
            return forkJoin(pipelineExecutionObservables);
        }
        return throwError({ error: "simulation not ready for execution" });
    }

    deleteProject(id): Observable<any> {
        return this.http.delete(environment.apiURL + "project/" + id + "/").pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to delete project!` });
            })
        );
    }

    isExecutionReady(): boolean {
        return this.project ? this.project.dataset && this.project.location && this.project.pipelines : null;
    }
}
