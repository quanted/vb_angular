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

    setLocationHeader(location): void {
        if (location) {
            this.locationName = `${location.name}, ${location.description}`;
        } else {
            this.locationName = "No location selected";
        }
        this.canExecute = this.projectService.isExecutionReady();
    }

    setDatasetHeader(dataset): void {
        if (dataset) {
            this.datasetName = dataset.name;
        } else {
            this.datasetName = "No dataset selected";
        }
        this.canExecute = this.projectService.isExecutionReady();
    }

    setPipelinesHeader(pipelines): void {
        if (pipelines) {
            this.pipelines = pipelines;
            const typeList = [];
            for (let pipeline of pipelines) {
                typeList.push(pipeline.name);
            }
            this.pipelineNames = typeList;
            if (this.pipelines.length < 1) {
                this.pipelineNames = ["No pipelines selected"];
            }
        }
        this.canExecute = this.projectService.isExecutionReady();
    }

    executeProject(): void {
        this.projectService.executeProject(this.project).subscribe((response) => {
            console.log("execute response: ", response);
        });
    }
}
