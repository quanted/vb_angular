import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable, of, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";

import { environment } from "../../environments/environment";

import { PipelineService } from "./pipeline.service";

@Injectable({
    providedIn: "root",
})
export class ProjectService {
    private ngUnsubscribe = new Subject();

    constructor(private http: HttpClient, private pipelineService: PipelineService) {}

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getProjects(): Observable<any> {
        return this.http.get(environment.apiURL + "project/").pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to fetch projects!` });
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

    cloneProject(project): Observable<any> {
        const newProject = { ...project };
        newProject.name = project.name + " - Copy";
        return this.createProject(newProject);
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
