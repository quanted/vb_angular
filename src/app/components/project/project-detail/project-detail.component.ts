import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { DatasetService } from "src/app/services/dataset.service";
import { LocationService } from "src/app/services/location.service";

import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-project-detail",
    templateUrl: "./project-detail.component.html",
    styleUrls: ["./project-detail.component.css"],
})
export class ProjectDetailComponent implements OnInit {
    @Input() project;
    @Output() projectDeleted: EventEmitter<any> = new EventEmitter<any>();

    locationName = "";
    datasetName = "";
    pipelines = [];

    constructor(
        private router: Router,
        private projectService: ProjectService,
        private locationService: LocationService,
        private datasetService: DatasetService
    ) {}

    ngOnInit(): void {
        this.locationService.getLocations().subscribe((locations) => {
            for (let location of locations) {
                if (location.id === this.project.location) {
                    this.locationName = location.name;
                }
            }
        });
        if (this.project.dataset) {
            this.datasetService.getDataset(this.project.dataset).subscribe((dataset) => {
                this.datasetName = dataset.name;
            });
        }
    }

    editProject(project) {
        this.router.navigateByUrl(`project/${project.id}`);
    }

    executeProject(project): void {
        this.projectService.executeProject(project);
    }

    gotoDashboard(project) {
        this.router.navigateByUrl(`dashboard/${project.id}`);
    }

    cloneProject(project) {
        this.projectService.cloneProject(project).subscribe((response) => {
            console.log("clone: ", response);
            this.router.navigateByUrl(`project/${response.id}`);
        });
    }

    deleteProject(project) {
        this.projectService.deleteProject(project.id).subscribe(() => {
            this.projectDeleted.emit();
        });
    }
}
