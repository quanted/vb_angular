import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PipelineService } from "src/app/services/pipeline.service";
import { PipelineInfoModel } from "../../../models/pipeline-info.model";

@Component({
    selector: "app-pipelines",
    templateUrl: "./pipelines.component.html",
    styleUrls: ["./pipelines.component.css"],
})
export class PipelinesComponent implements OnInit {
    @Input() project;
    @Output() setPipelines: EventEmitter<any> = new EventEmitter<any>();

    pipelines: any[] = [];

    // ui flags
    creatingPipeline = false;
    globalOptionsOpenState = false;
    projectPipelinesOpenState = false;

    constructor(private pipelineService: PipelineService) {}

    ngOnInit(): void {
        this.pipelineService.getProjectPipelines(this.project.id).subscribe((project) => {
            this.pipelines = project.pipelines;
            this.setPipelines.emit(this.pipelines);
        });
    }

    openPipelineCreationPanel(): void {
        this.creatingPipeline = true;
    }

    pipelineCreated(event): void {}

    deletePipeline(pipeline): void {}

    pipelineCreationCancelled(): void {
        this.creatingPipeline = false;
    }
}
