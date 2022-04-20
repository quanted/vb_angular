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
    estimatorSelectForm: FormGroup;
    estimatorOptionsForm: FormGroup;

    selectedEstimator = null;
    estimatorOptions = null;

    constructor(private fb: FormBuilder, private pipelineService: PipelineService) {}

    ngOnInit(): void {
        this.pipelineService.getPipelinesMetadata().subscribe((pipelinesMetadata) => {
            this.pipelinesMetadata = pipelinesMetadata.filter((pipeline) => {
                return pipeline.ptype != "vbhelper";
            });
            this.buildEstimatorSelectForm();
        });
    }

    buildEstimatorSelectForm(): void {
        this.estimatorSelectForm = this.fb.group({
            estimator: ["", Validators.required],
        });
    }

    selectEstimator(): void {
        this.selectedEstimator = this.pipelinesMetadata.find((estimator) => {
            return estimator.name == this.estimatorSelectForm.get("estimator").value;
        });
        this.buildEstimatorOptionsForm();
    }

    buildEstimatorOptionsForm(): void {
        const parameters = this.selectedEstimator["hyper-parameters"];
        // map the each option's range/values to something that the forms can use
        for (let parameter of parameters) {
            let values = [];
            switch (parameter.vtype) {
                case "bool":
                    parameter.options = ["True", "False"];
                    break;
                case "int":
                    values = parameter.options.split(":");
                    parameter["min"] = values[0];
                    parameter["max"] = values[1];
                    break;
                case "float":
                    values = parameter.options.split(",");
                    parameter["min"] = values[0];
                    parameter["max"] = values[1].trim();
                    break;
                case "str":
                    parameter.options = JSON.parse(parameter.options.replaceAll("'", '"'));
                    break;
            }
        }
        this.estimatorOptions = parameters;

        const fields = {};
        for (let option of this.estimatorOptions) {
            fields[option.name] = ["", Validators.required];
        }
        this.estimatorOptionsForm = this.fb.group(fields);

        const optionsDefaults = [];
        for (let option of this.estimatorOptions) {
            optionsDefaults[option.name] = option.value;
        }
        this.estimatorOptionsForm.setValue(optionsDefaults);
    }

    addPipeline(): void {
        const pipeline = {
            project: this.project.id,
            name: this.selectedEstimator.name,
            description: this.selectedEstimator.description,
            type: this.selectedEstimator.ptype,
            metadata: JSON.stringify({ parameters: this.estimatorOptionsForm.value }),
        };
        this.pipelineService.addPipeline(pipeline).subscribe((response) => {
            this.pipelineCreated.emit();
        });
    }

    cancelPipeline(): void {
        this.pipelineCancelled.emit();
    }
}
