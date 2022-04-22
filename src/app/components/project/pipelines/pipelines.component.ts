import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
    selector: "app-pipelines",
    templateUrl: "./pipelines.component.html",
    styleUrls: ["./pipelines.component.css"],
})
export class PipelinesComponent implements OnInit {
    @Input() project;
    @Output() setPipelinesHeader: EventEmitter<any> = new EventEmitter<any>();

    pipelines: any[] = [];

    // ui flags
    creatingPipeline = false;
    globalOptionsOpenState = false;
    projectPipelinesOpenState = false;

    constructor(private pipelineService: PipelineService) {}

    ngOnInit(): void {
        this.getProjectPipelines();
    }

    getProjectPipelines(): void {
        this.pipelineService.getProjectPipelines(this.project.id).subscribe((pipelines) => {
            this.pipelines = pipelines;
            this.setPipelinesHeader.emit(this.pipelines);
        });
    }

    openPipelineCreationPanel(): void {
        this.creatingPipeline = true;
    }

    pipelineCreated(): void {
        this.creatingPipeline = false;
        this.getProjectPipelines();
    }

    deletePipeline(pipeline): void {}

    pipelineCreationCancelled(): void {
        this.creatingPipeline = false;
    }
}
