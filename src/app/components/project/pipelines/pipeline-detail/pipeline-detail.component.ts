import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
    selector: "app-pipeline-detail",
    templateUrl: "./pipeline-detail.component.html",
    styleUrls: ["./pipeline-detail.component.css"],
})
export class PipelineDetailComponent implements OnInit {
    @Input() project;
    @Input() pipeline;

    pipelineOptions = null;

    // ui flag
    pipelineOptionsOpenState = false;

    pipelineOptionsForm: FormGroup;

    constructor(private fb: FormBuilder, private pipelineService: PipelineService) {}

    ngOnInit(): void {
        this.pipelineService.getPipelinesMetadata().subscribe((pipelinesMetadata) => {
            const parameters = pipelinesMetadata.find((pipeline) => {
                return this.pipeline.type === pipeline.ptype;
            })["hyper-parameters"];
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
            this.pipelineOptions = parameters;
            this.buildPipelineOptionsForm();
        });
    }

    buildPipelineOptionsForm(): void {
        const fields = {};
        for (let option of this.pipelineOptions) {
            fields[option.name] = ["", Validators.required];
        }
        this.pipelineOptionsForm = this.fb.group(fields);
        this.updatePipelineOptions();
    }

    updatePipelineOptions(): void {
        // TODO: this is because of backend inconsistencies
        if (this.pipeline.metadata.parameters) {
            this.pipeline.metadata = JSON.parse(this.pipeline.metadata.parameters.replaceAll("'", '"'));
        }
        this.pipelineOptionsForm.setValue(this.pipeline.metadata);
    }
}
