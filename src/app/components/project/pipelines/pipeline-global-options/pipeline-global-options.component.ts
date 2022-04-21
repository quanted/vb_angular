import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
    selector: "app-pipeline-global-options",
    templateUrl: "./pipeline-global-options.component.html",
    styleUrls: ["./pipeline-global-options.component.css"],
})
export class PipelineGlobalOptionsComponent implements OnInit {
    @Input() project: any;
    outerPipelineOptions: any;

    vbHelper;

    globalOptionsForm: FormGroup;
    globalOptionsValues;

    constructor(private fb: FormBuilder, private pipelineService: PipelineService) {}

    ngOnInit(): void {
        this.pipelineService.getPipelinesMetadata().subscribe((pipelinesMetadata) => {
            this.vbHelper = pipelinesMetadata.find((pipeline) => {
                return pipeline.ptype === "vbhelper";
            });
            const vbHelperOptions = this.vbHelper["hyper-parameters"];
            // map the each option's range/values to something that the forms can use
            for (let parameter of vbHelperOptions) {
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
                    case "string":
                        parameter.options = JSON.parse(parameter.options.replaceAll("'", '"'));
                        break;
                }
            }
            this.outerPipelineOptions = vbHelperOptions;
            this.buildOptionsForm();

            const globalOptionsDefaults = {};
            for (let option of this.outerPipelineOptions) {
                globalOptionsDefaults[option.name] = option.value;
            }

            this.pipelineService
                .getGlobalOptionsValues(this.project.id, globalOptionsDefaults)
                .subscribe((vbHelper) => {
                    // this will be an error if the project doesn't have any pipelines
                    if (vbHelper.error) {
                        this.globalOptionsValues = globalOptionsDefaults;
                    } else {
                        this.vbHelper = vbHelper;
                        this.globalOptionsValues = JSON.parse(vbHelper.metadata.parameters.replaceAll("'", '"'));
                    }
                    this.setOptionFormValues();
                });
        });
    }

    buildOptionsForm(): void {
        const fields = {};
        for (let option of this.outerPipelineOptions) {
            fields[option.name] = ["", Validators.required];
        }
        this.globalOptionsForm = this.fb.group(fields);
    }

    setOptionFormValues(): void {
        this.globalOptionsForm.setValue(this.globalOptionsValues);
    }

    updateGlobalOptions(): void {
        this.pipelineService.updatePipeline(this.vbHelper, this.globalOptionsForm.value).subscribe((response) => {
            console.log("updateGlobalOptions.response: ", response);
        });
    }
}
