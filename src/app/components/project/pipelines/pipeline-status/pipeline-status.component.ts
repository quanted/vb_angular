import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
    selector: "app-pipeline-status",
    templateUrl: "./pipeline-status.component.html",
    styleUrls: ["./pipeline-status.component.css"],
})
export class PipelineStatusComponent implements OnInit, OnDestroy {
    @Input() project;

    pipelineName = "";
    pipelineStage = "";
    pipelineStatus = "";
    pipelineMessage = "";
    processStatusMessage = "";

    pipelineUpdateTimer: ReturnType<typeof setInterval>;

    constructor(private pipelineService: PipelineService) {}

    ngOnInit(): void {
        console.log("project: ", this.project);
        // FOR TESTING
        this.project["executed"] = false;
        this.project["completed"] = false;
        //need to move this so it only runs if there are pipelines executing
        this.updatePipelines();
        if (this.project.executed && !this.project.completed) {
            this.pipelineUpdateTimer = setInterval(() => {
                this.updatePipelines();
            }, 5000);
        }
    }

    updatePipelines() {
        this.processStatusMessage = "Updating status...";
        this.pipelineService.getAllPipelines(this.project.id).subscribe((pipelines) => {
            let executionCompleted = false;
            if (pipelines.length > 0) {
                for (let pipeline of pipelines) {
                    if (pipeline.type === "vbhelper") {
                        this.pipelineName = pipeline.name;
                        // vbhelper will only have a pipeline.metadata.status once it has been executed
                        if (pipeline.metadata.status) {
                            this.pipelineMessage = pipeline.metadata.message;
                            this.pipelineStage = pipeline.metadata.stage;
                            this.pipelineStatus = pipeline.metadata.status;
                        } else {
                            this.processStatusMessage = "Pipeline(s) unexecuted";
                        }
                    }
                }
            } else {
                this.processStatusMessage = "No Project pipelines";
            }

            if (executionCompleted) {
                this.processStatusMessage = "Pipeline execution complete";
                clearInterval(this.pipelineUpdateTimer);
            }
        });
    }

    ngOnDestroy() {
        clearInterval(this.pipelineUpdateTimer);
    }
}
