import { Component, Input, OnInit } from "@angular/core";

import { Metadata } from "src/app/models/metadata.model";

import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-project-meta-edit",
    templateUrl: "./project-meta-edit.component.html",
    styleUrls: ["./project-meta-edit.component.css"],
})
export class ProjectMetaEditComponent implements OnInit {
    @Input() project: any = {};
    formType = "Update Project Metadata";

    constructor(private projectService: ProjectService) {}

    ngOnInit(): void {}

    updateMetadata(metadata: Metadata): void {
        this.projectService.updateProjectMetadata(metadata).subscribe((response) => {
            console.log("end: ", response);
        });
    }
}
