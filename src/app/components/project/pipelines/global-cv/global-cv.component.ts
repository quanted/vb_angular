import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { PipelineService } from "../../../../services/pipeline.service";

@Component({
    selector: "app-global-cv",
    templateUrl: "./global-cv.component.html",
    styleUrls: ["./global-cv.component.css"],
})
export class GlobalCvComponent implements OnInit, OnChanges {
    @Input() vbHelper: any;
    @Input() vbHelperPipeInfo: any;
    cvFormGroup: FormGroup;
    disabled = true;
    outer = false;

    constructor(private formBuilder: FormBuilder, private pipelineService: PipelineService) {}

    ngOnInit(): void {
        this.cvFormGroup = this.formBuilder.group({
            formControls: new FormArray([]),
        });
        this.outer = this.vbHelper.metadata.outer_cv === "True";
        this.setFormControls();
        this.cvFormGroup.disable();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty("vbHelper") || changes.hasOwnProperty("vbHelperPipeInfo")) {
            this.cvFormGroup = this.formBuilder.group({
                formControls: new FormArray([]),
            });
            this.outer = this.vbHelper.metadata.outer_cv === "True";
            this.setFormControls();
            this.cvFormGroup.disable();
        }
    }

    /**
     *
     */
    setFormControls() {
        // Create controls as formArray
        const control = this.cvFormGroup?.controls.formControls as FormArray;

        // Parse vbhelper parameters
        if (typeof this.vbHelper.metadata.parameters === "string") {
            this.vbHelper.metadata.parameters = JSON.parse(this.vbHelper.metadata.parameters.replace(/'/g, '"'));
        }

        // Iterate over key/value pairs of vbHelper params
        for (const key in this.vbHelper.metadata.parameters) {
            if (this.vbHelper.metadata.parameters.hasOwnProperty(key)) {
                const newGroup = this.formBuilder.group({
                    [key]: [this.vbHelper.metadata.parameters[key]],
                });
                control.push(newGroup);
            }
        }
    }

    /**
     * Getter used in HTML for generating the forms.
     */
    get hyperParams(): FormArray {
        return this.cvFormGroup.get("formControls") as FormArray;
    }

    /**
     *
     */
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

    /**
     *
     */
    toggleCV() {
        if (this.disabled) {
            this.cvFormGroup.enable();
        } else {
            this.updateCVPipe();
            this.cvFormGroup.disable();
        }
        this.disabled = !this.disabled;
    }

    updateOuterCV() {
        // Stringify and update
        if (this.outer) {
            this.vbHelper.metadata.outer_cv = "True";
        } else {
            this.vbHelper.metadata.outer_cv = "False";
        }
        this.vbHelper.metadata = JSON.stringify(this.vbHelper.metadata);
        this.pipelineService.updatePipeline(this.vbHelper).subscribe();
        // Unstringify
        this.vbHelper.metadata = JSON.parse(this.vbHelper.metadata);
    }

    updateCVPipe() {
        // Get hyperparams from cvFormGroup
        const hyperParams = this.cvFormGroup.controls.formControls as FormArray;
        if (hyperParams.controls.length > 0) {
            // Get each formgroup in the hyperparams formarray and add values to object..
            const hyperParamsObj = {};
            for (const control of hyperParams.controls) {
                const key = Object.entries(control.value)?.toString().split(",");
                hyperParamsObj[`${key[0]}`] = key[1];
            }

            // Assign value to vbhelper parameters
            this.vbHelper.metadata.parameters = hyperParamsObj;

            // Parse vbhelper estimators before stringifying
            if (typeof this.vbHelper.metadata.estimators === "string") {
                this.vbHelper.metadata.estimators = JSON.parse(this.vbHelper.metadata.estimators.replace(/'/g, '"'));
            }

            // Stringify and update
            this.vbHelper.metadata = JSON.stringify(this.vbHelper.metadata);
            this.pipelineService.updatePipeline(this.vbHelper).subscribe();
            // Unstringify
            this.vbHelper.metadata = JSON.parse(this.vbHelper.metadata);
        }
    }
}
