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
    creatingPipeline = false;
    pipelines = [];
    pipelineInfo: PipelineInfoModel[];
    vbHelperPipeInfo: any;
    vbHelper: any;
    @Output() setPipelines: EventEmitter<any> = new EventEmitter<any>();

    globalCVOpenState = false;

    constructor(private pipelineService: PipelineService) {}

    ngOnInit(): void {
        this.getPipelineInfo();
    }

    parseVBHelepr() {
        if (typeof this.vbHelper.metadata.parameters === "string") {
            this.vbHelper.metadata.parameters = JSON.parse(this.vbHelper.metadata.parameters.replace(/'/g, '"'));
        }

        if (typeof this.vbHelper.metadata.estimators === "string") {
            this.vbHelper.metadata.estimators = JSON.parse(this.vbHelper.metadata.estimators.replace(/'/g, '"'));
        }
    }

    /**
     * Calls the pipeline service to populate the "create pipeline" UI.
     */
    getPipelineInfo() {
        // Get all pipeline info
        this.pipelineService.getPipelines().subscribe((pipelines) => {
            // Find vbhelper info
            this.vbHelperPipeInfo = pipelines.find((pipeline) => {
                return pipeline.ptype === "vbhelper";
            });
            // Remove vbhelper info and return new array
            const index = pipelines.indexOf(this.vbHelperPipeInfo);
            pipelines.splice(index, 1);
            this.pipelineInfo = pipelines;

            // Now that vbHelperPipeInfo is guaranteed to be populated,
            // start callback to get/create vbhelper
            this.getVBHelperPipeline();
        });
    }

    createPipeline(): void {
        this.creatingPipeline = true;
    }

    deletePipeline(pipeline): void {
        const index = this.vbHelper.metadata.estimators.indexOf(pipeline);
        this.vbHelper.metadata.estimators.splice(index, 1);
        // Stringify
        this.vbHelper.metadata = JSON.stringify(this.vbHelper.metadata);
        this.pipelineService.updatePipeline(this.vbHelper).subscribe((res) => {
            this.vbHelper = res;
            this.updateAvailablePipelineList();
        });
    }

    pipelineCreated(event): void {
        this.vbHelper = { ...event };
        this.creatingPipeline = false;
        this.updateAvailablePipelineList();
    }

    pipelineCancelled(): void {
        this.creatingPipeline = false;
    }

    /**
     * Makes http request to get the vbhelper pipeline. If no pipelines found,
     * makes call to create a new vbhelper pipeline.
     */
    getVBHelperPipeline(): void {
        this.pipelineService.getProjectPipelines(this.project.id).subscribe((pipelines) => {
            this.vbHelper = pipelines[0];
            // No pipelines returned, create a new one.
            if (this.vbHelper === undefined) {
                this.createVBHelper();
            } else {
                this.updateAvailablePipelineList();
            }
        });
    }

    /**
     * Makes http request to create a new vbhelper pipeline.
     */
    createVBHelper() {
        // Populate default info and parameters with vbHelperPipeInfo
        this.vbHelper = {
            project: this.project.id,
            description: this.vbHelperPipeInfo.description,
            type: this.vbHelperPipeInfo.ptype,
            name: this.vbHelperPipeInfo.name,
            metadata: {
                parameters: {},
                estimators: [],
                outer_cv: "True",
            },
        };

        // Add default parameters vbHelperInfo
        this.vbHelperPipeInfo["hyper-parameters"].forEach((param) => {
            this.vbHelper.metadata.parameters[`${param.name}`] = param.value;
        });

        // Stringify metadata
        this.vbHelper.metadata = JSON.stringify(this.vbHelper.metadata);

        // Create the vbhelper pipeline for this project
        this.pipelineService.addPipeline(this.vbHelper).subscribe((res) => {
            this.vbHelper = res;
            // Unstringify
            this.updateAvailablePipelineList();
        });
    }

    /**
     * Gets the list of estimators from vbHelper and updates UI.
     */
    updateAvailablePipelineList(): void {
        this.parseVBHelepr();
        this.pipelines = this.vbHelper.metadata.estimators;
        if (this.pipelines !== undefined) {
            this.setPipelines.emit(this.pipelines);
        }
    }
}
