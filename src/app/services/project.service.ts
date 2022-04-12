import { Injectable, OnDestroy } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";

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

    private projects;
    private selectedProjectID;
    private project;

    constructor(private http: HttpClient, private pipelineService: PipelineService) {
        this.projectSubject = new BehaviorSubject(this.project);
        this.getProjects().subscribe((projects) => {
            this.projects = projects;
            this.loadProject(this.selectedProjectID);
        });
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
            tap((projects) => {
                this.projects = projects;
            }),
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to fetch projects!` });
            })
        );
    }

    loadProject(projectID): void {
        this.selectedProjectID = projectID;
        if (this.projects) {
            const project = this.projects.find((project) => {
                return project.id == projectID;
            });
            this.project = project;
            this.projectSubject.next(this.project);
        }
    }

    createProject(project): Observable<any> {
        return this.http.post(environment.apiURL + "project/", project).pipe(
            tap((project) => {
                this.project = project;
                this.projects.push(project);
                this.projectSubject.next(this.project);
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
            tap((response) => {
                console.log("projectService.updateProject returned");
            }),
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to update project!` });
            })
        );
    }

    executeProject(project): Observable<any> {
        for (let pipeline of project.pipelines) {
            console.log(`project ${project.id} executing ${pipeline.name} pipeline on dataset ${project.dataset}`);
            this.pipelineService.executePipeline(project, pipeline.id).subscribe((response) => {
                console.log("execute: ", response);
            });
        }
        return;
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
}
