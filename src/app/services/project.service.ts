import { Injectable, OnDestroy } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, EMPTY, forkJoin, Observable, of, Subject, throwError } from "rxjs";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";

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

    cloneProject(project): Observable<any> {
        const newProject = deepCopy.Copy(project);
        newProject.name = project.name + " - Copy";
        return this.createProject(newProject);
    }

    updateProjectMetadata(metadata: Metadata): Observable<any> {
        const updatedProject = deepCopy.Copy(this.project);
        updatedProject.name = metadata.name;
        updatedProject.description = metadata.description;
        return this.updateProject(updatedProject);
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
            const pipelineExecutionObserveables: any[] = [];
            for (let pipeline of project.pipelines) {
                console.log(`project ${project.id} executing ${pipeline.name} pipeline on dataset ${project.dataset}`);
                pipelineExecutionObserveables.push(this.pipelineService.executePipeline(project, pipeline.id));
            }
            return forkJoin(pipelineExecutionObserveables);
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
