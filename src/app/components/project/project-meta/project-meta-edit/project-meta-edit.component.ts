import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-project-meta-edit",
    templateUrl: "./project-meta-edit.component.html",
    styleUrls: ["./project-meta-edit.component.css"],
})
export class ProjectMetaEditComponent implements OnInit {
    @Input() projectMetadata: any = {};
    formType = "Update Project Metadata";
    constructor() {}

    ngOnInit(): void {}

    updateMetadata(metadata): void {}
}
