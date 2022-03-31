import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PipelineService } from "src/app/services/pipeline.service";

import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-project",
    templateUrl: "./project.component.html",
    styleUrls: ["./project.component.css"],
})
export class ProjectComponent implements OnInit {
    panelOpenState = false;

    canExecute = false;

    project = null;
    pipelines = [];
    locationName = "No location selected";
    datasetName = "No data selected";
    pipelineNames = "No pipelines selected";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private projectService: ProjectService,
        private pipelineService: PipelineService
    ) {}

    ngOnInit(): void {
        if (this.route.paramMap) {
            const projectID = this.route.snapshot.paramMap.get("id");
            this.projectService.loadProject(projectID);
        }
        this.projectService.monitorProject().subscribe((project) => {
            console.log("monitor: ", project);
            this.project = project;
        });
    }

    // js is weird
    // console.log(+[++[[]][+[]]+[[][[]]+[]][+[]][++[++[++[[]][+[]]][+[]]][+[]]]+[++[[]][+[]]]+[+[]]+[+[]]+[+[]]][+[]]); ?

    editName(): void {
        console.log("edit name");
    }

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
            this.checkReady();
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
            this.checkReady();
        });
    }

    setPipelines(pipelines): void {
        this.pipelines = [...pipelines];
        const typeList = [];
        for (let pipeline of pipelines) {
            typeList.push(pipeline.type);
        }
        this.pipelineNames = typeList.join(", ");
        if (this.pipelines.length < 1) {
            this.pipelineNames = "No pipelines selected";
        }
        this.checkReady();
        // console.log("project.setPipelines() ", this.pipelines);
    }

    checkReady(): void {
        this.canExecute = this.project.location && this.project.dataset && this.pipelines.length > 0;
    }

    executeProject(): void {
        this.projectService.executeProject(this.project);
    }
}
