import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-project",
    templateUrl: "./project.component.html",
    styleUrls: ["./project.component.css"],
})
export class ProjectComponent implements OnInit {
    panelOpenState = false;

    projectID = null;
    project = null;
    pipelines = [];
    locationName = "No location selected";
    datasetName = "No data selected";
    pipelineNames = ["No pipelines selected"];

    canExecute = false;

    constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

    ngOnInit(): void {
        if (this.route.paramMap) {
            this.projectID = this.route.snapshot.paramMap.get("id");
        }
        this.projectService.getProject(this.projectID).subscribe((project) => {
            this.project = project;
            this.canExecute = this.projectService.isExecutionReady();
        });
    }

    // js is weird
    // console.log(+[++[[]][+[]]+[[][[]]+[]][+[]][++[++[++[[]][+[]]][+[]]][+[]]]+[++[[]][+[]]]+[+[]]+[+[]]+[+[]]][+[]]); ?

    setLocation(location): void {
        if (location) {
            this.locationName = location.name + ", " + location.description;
            this.project.location = location.id;
        } else {
            this.locationName = "No location selected";
            this.project.location = null;
        }

        const update = { ...this.project };
        update.metadata = JSON.stringify(this.project.metadata);
        this.projectService.updateProject(update).subscribe((project) => {
            // needs error handling
            this.canExecute = this.projectService.isExecutionReady();
        });
    }

    setDataset(dataset): void {
        if (dataset) {
            this.datasetName = dataset.name;
            this.project.dataset = dataset.id;
            this.project["metadata"] = { ...dataset.metadata };
        } else {
            this.datasetName = "No data selected";
            this.project.dataset = null;
            this.project["metadata"] = null;
        }

        const update = { ...this.project };
        if (update["metadata"]) {
            update["metadata"] = JSON.stringify({ ...dataset.metadata });
        }
        this.projectService.updateProject(update).subscribe((project) => {
            // needs error handling
            this.canExecute = this.projectService.isExecutionReady();
        });
    }

    setPipelines(pipelines): void {
        this.pipelines = [...pipelines];
        const typeList = [];
        for (let pipeline of pipelines) {
            typeList.push(pipeline.type);
        }
        this.pipelineNames = typeList;
        if (this.pipelines.length < 1) {
            this.pipelineNames = ["No pipelines selected"];
        }
        this.canExecute = this.projectService.isExecutionReady();
        // console.log("project.setPipelines() ", this.pipelines);
    }

    executeProject(): void {
        this.projectService.executeProject(this.project).subscribe((response) => {
            console.log("execute response: ", response);
        });
    }
}
