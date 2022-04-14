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
                this.globalOptionsValues = globalValues.globalOptionValues;
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

    getHyperParamOptions(options: string): string[] {
        let result: string[] = [];

        // Check for range of integer values.
        if (options.includes(":") && !options.includes(".")) {
            // Allocate array of value range.
            const splits = options.split(":", 2);
            const min = Number(splits[0]);
            const max = splits[1] === "inf" ? 100 : Number(splits[1]) + 1;
            for (let i = min; i < max; i++) {
                result.push(i.toString());
            }
        } else if (options.includes(":") && options.includes(".")) {
            // Allocate range of float values
            const splits = options.split(":", 2);
            const min = Number.parseFloat(splits[0]);
            const max = Number.parseFloat(splits[1]);
            for (let i = min; i < max; i += 0.1) {
                result.push(i.toPrecision(1).toString());
            }
        } else if (options.includes(",") && options.includes(".")) {
            // Allocate range of float values
            const splits = options.split(",", 2);
            const min = Number.parseFloat(splits[0]);
            const max = Number.parseFloat(splits[1]);
            for (let i = min; i < max; i += 0.1) {
                result.push(i.toPrecision(1).toString());
            }
        } else {
            // Allocate string parameters options
            options = options.replace(/[\[\]']+/g, "");
            options = options.replace("'", " ");
            result = options.split(/\s*,\s*/);
        }
        return result;
    }

    updateOuterCV() {}

    updateCVPipe() {}
}
