import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ProjectService } from "src/app/services/project.service";
import { ProjectMetaComponent } from "../project-meta/project-meta.component";

@Component({
    selector: "app-project-create",
    templateUrl: "./project-create.component.html",
    styleUrls: ["./project-create.component.css"],
})
export class ProjectCreateComponent implements OnInit {
    formType = "Create Project";

    @ViewChild(ProjectMetaComponent)
    private editor: ProjectMetaComponent;

    constructor(private router: Router, private projectService: ProjectService) {}

    ngOnInit(): void {}

    createProject(project): void {
        // the object emitted by button click from project-meta-component
        // will either be a project - proceed
        // or null                  - cancel
        console.log("project: ", project);
        if (project) {
            this.editor.statusMessage = "creating project";
            this.projectService.createProject(project).subscribe((project) => {
                if (project.error) {
                    this.editor.statusMessage = project.error;
                    return;
                }
                this.editor.statusMessage = "";
                this.router.navigateByUrl(`project/${project.id}`);
            });
        } else {
            this.editor.statusMessage = "";
            this.router.navigateByUrl("home");
        }
    }
}
