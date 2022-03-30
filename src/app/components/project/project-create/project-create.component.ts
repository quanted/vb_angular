import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-project-create",
    templateUrl: "./project-create.component.html",
    styleUrls: ["./project-create.component.css"],
})
export class ProjectCreateComponent implements OnInit {
    formType = "Create Project";
    statusMessage = "";

    constructor(private router: Router, private projectService: ProjectService) {}

    ngOnInit(): void {}

    createProject(project): void {
        console.log("project: ", project);
        if (project) {
            this.projectService.createProject(project).subscribe((project) => {
                if (project.error) {
                    this.statusMessage = project.error;
                }
                this.router.navigateByUrl(`project/${project.id}`);
            });
        } else {
            this.router.navigateByUrl("home");
        }
    }
}
