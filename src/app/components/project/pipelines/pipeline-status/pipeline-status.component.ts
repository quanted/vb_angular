import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
    selector: "app-pipeline-status",
    templateUrl: "./pipeline-status.component.html",
    styleUrls: ["./pipeline-status.component.css"],
})
export class PipelineStatusComponent implements OnInit, OnDestroy {
    @Input() project;
    pipelines = [];

    panelOpenState = false;

    pipelinesStatusMessage = "";

    pipelineUpdateTimer: ReturnType<typeof setInterval>;

    constructor(private pipelineService: PipelineService) {}

    ngOnInit(): void {
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
        this.pipelinesStatusMessage = "Updating status...";
        this.pipelineService.getProjectPipelines(this.project.id).subscribe((pipelines) => {
            if (pipelines.length > 0) {
                // console.log("pipelines: ", pipelines);
                this.pipelines = [...pipelines];

                let pipelinesCompleted = true;

                for (let pipeline of this.pipelines) {
                    const pipelineStatus = pipeline.metadata.status;
                    if (pipelineStatus) {
                        this.pipelinesStatusMessage = "Pipelines executing...";

                        if (pipelineStatus !== "Completed and model saved") {
                            pipelinesCompleted = false;
                        } else {
                            pipeline["completed"] = true;
                        }
                    } else {
                        this.pipelinesStatusMessage = "Pipeline(s) unexecuted";
                        pipelinesCompleted = false;
                    }
                }

                if (pipelinesCompleted) {
                    this.pipelinesStatusMessage = "Pipeline execution complete";
                    clearInterval(this.pipelineUpdateTimer);
                }
            } else {
                this.pipelinesStatusMessage = "No pipelines";
            }
        });
    }

    cancelPipeline(): void {
        console.log("cancel pipeline not implemented");
    }

    ngOnDestroy() {
        clearInterval(this.pipelineUpdateTimer);
    }
}
