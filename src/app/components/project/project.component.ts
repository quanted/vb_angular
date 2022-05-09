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
    locationHeaderText = "No location selected";
    datasetHeaderText = "No data selected";
    pipelineHeaderText = "No pipelines selected";

    canExecute = false;

    constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

    ngOnInit(): void {
        if (this.route.paramMap) {
            this.projectID = this.route.snapshot.paramMap.get("id");
        }
        this.projectService.getProject(this.projectID).subscribe((project) => {
            this.project = project;
            this.checkExecutionReady();
        });
    }

    // js is weird
    // console.log(+[++[[]][+[]]+[[][[]]+[]][+[]][++[++[++[[]][+[]]][+[]]][+[]]]+[++[[]][+[]]]+[+[]]+[+[]]+[+[]]][+[]]); ?

    setLocationHeader(location): void {
        if (location) {
            this.locationHeaderText = `${location.name}, ${location.description}`;
        } else {
            this.locationHeaderText = "No location selected";
        }
        this.checkExecutionReady();
    }

    setDatasetHeader(dataset): void {
        if (dataset) {
            this.datasetHeaderText = `${dataset.name}, ${dataset.description}`;
        } else {
            this.datasetHeaderText = "No dataset selected";
        }
        this.checkExecutionReady();
    }

    setPipelinesHeader(pipelines): void {
        if (pipelines) {
            this.pipelines = pipelines;
            const typeList = [];
            for (let pipeline of pipelines) {
                typeList.push(pipeline.name);
                this.pipelineHeaderText = typeList.join(", ");
            }
            if (this.pipelines.length < 1) {
                this.pipelineHeaderText = "No pipelines selected";
            }
        }
        this.checkExecutionReady();
    }

    checkExecutionReady(): void {
        this.projectService.isExecutionReady(this.project).subscribe((isReady) => {
            this.canExecute = isReady;
        });
    }

    executeProject(): void {
        this.projectService.executeProject(this.project).subscribe((response) => {
            console.log("execute response: ", response);
        });
    }
}
