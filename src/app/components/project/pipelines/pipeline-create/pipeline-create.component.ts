import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
    selector: "app-pipeline-create",
    templateUrl: "./pipeline-create.component.html",
    styleUrls: ["./pipeline-create.component.css"],
})
export class PipelineCreateComponent implements OnInit {
    @Input() project;
    @Output() pipelineCreated = new EventEmitter();
    @Output() pipelineCancelled = new EventEmitter();

    pipelinesMetadata;
    pipelineForm: FormGroup;

    selectedEstimator = null;

    constructor(private fb: FormBuilder, private pipelineService: PipelineService) {}

    ngOnInit(): void {
        this.pipelineForm = this.fb.group({});
        this.pipelineService.getPipelinesMetadata().subscribe((pipelinesMetadata) => {
            this.pipelinesMetadata = pipelinesMetadata.filter((pipeline) => {
                return pipeline.ptype != "vbhelper";
            });
            this.buildPipelineCreateForm();
        });
    }

    buildPipelineCreateForm(): void {
        this.pipelineForm = this.fb.group({
            estimator: ["", Validators.required],
        });
        console.log("pipelinesMetadata: ", this.pipelinesMetadata);
    }

    selectEstimator(): void {
        this.selectedEstimator = this.pipelinesMetadata.find((estimator) => {
            return estimator.name == this.pipelineForm.get("estimator").value;
        });
        console.log("selected estimator: ", this.selectedEstimator);
    }

    addPipeline(): void {}

    cancelPipeline(): void {
        this.pipelineCancelled.emit();
    }
}
