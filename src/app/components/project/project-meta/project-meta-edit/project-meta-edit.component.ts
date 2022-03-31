import { Component, Input, OnInit, ViewChild } from "@angular/core";

import { Metadata } from "src/app/models/metadata.model";

import { ProjectService } from "src/app/services/project.service";
import { ProjectMetaComponent } from "../project-meta.component";

@Component({
    selector: "app-project-meta-edit",
    templateUrl: "./project-meta-edit.component.html",
    styleUrls: ["./project-meta-edit.component.css"],
})
export class ProjectMetaEditComponent implements OnInit {
    @Input() project: any = {};
    formType = "Update Project Metadata";

    @ViewChild(ProjectMetaComponent)
    private editor: ProjectMetaComponent;

    constructor(private projectService: ProjectService) {}

    ngOnInit(): void {}

    updateMetadata(metadata: Metadata): void {
        this.editor.statusMessage = "updating...";
        this.projectService.updateProjectMetadata(metadata).subscribe((response) => {
            console.log("update: ", response);
            if (response.error) {
                this.editor.statusMessage = "error updating!";
                return;
            }
            this.editor.statusMessage = "update saved";
        });
    }
}
