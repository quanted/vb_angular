import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { PipelineService } from "src/app/services/pipeline.service";
import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-pipeline-detail",
    templateUrl: "./pipeline-detail.component.html",
    styleUrls: ["./pipeline-detail.component.css"],
})
export class PipelineDetailComponent implements OnInit {
    // a pipeline object
    @Input() pipeline = null;
    // the metadata for the input pipeline type
    pipelineMetadata = null;
    // available pipelines and their metadata
    @Input() pipelineInfo = null;

    pipelineOptionOpenState = false;

    pipelineOptionForm: FormGroup;

    constructor(private pipelineService: PipelineService, private projectService: ProjectService) {}

    ngOnInit(): void {
        console.log("pipeline: ", this.pipeline);
        console.log("pipelineInfo: ", this.pipelineInfo);
    }

    updatePipelineOptions(): void {
        this.pipelineService.updatePipeline(this.pipelineOptionForm.value);
    }
}
