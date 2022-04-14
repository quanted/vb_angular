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
    pipelinesGlobalOptions: any;

    globalOptionsForm: FormGroup;
    globalOptionsValues;

    constructor(private fb: FormBuilder, private pipelineService: PipelineService) {}

    ngOnInit(): void {
        this.globalOptionsForm = this.fb.group({});
        this.pipelineService.getPipelinesMetadata().subscribe((pipelinesMetadata) => {
            const parameters = pipelinesMetadata.find((pipeline) => {
                return pipeline.ptype === "vbhelper";
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
                    case "string":
                        parameter.options = JSON.parse(parameter.options.replaceAll("'", '"'));
                        break;
                }
            }
            this.pipelinesGlobalOptions = parameters;
            this.buildOptionsForm();

            this.pipelineService.getGlobalOptionValues(this.project.id).subscribe((globalValues) => {
                // this will be an error if the project doesn't have any pipelines
                if (globalValues.error) {
                    const globalOptionsDefaults = [];
                    for (let option of this.pipelinesGlobalOptions) {
                        globalOptionsDefaults[option.name] = option.value;
                    }
                    this.globalOptionsValues = globalOptionsDefaults;
                } else {
                    this.globalOptionsValues = globalValues.globalOptionValues;
                }
                this.setOptionFormValues();
            });
        });
    }

    buildOptionsForm(): void {
        const fields = {};
        for (let option of this.pipelinesGlobalOptions) {
            fields[option.name] = ["", Validators.required];
        }
        this.globalOptionsForm = this.fb.group(fields);
    }

    setOptionFormValues(): void {
        this.globalOptionsForm.setValue(this.globalOptionsValues);
    }
}
