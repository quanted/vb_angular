import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { PipelineService } from 'src/app/services/pipeline.service';
import {PipelineInfoModel} from '../../models/pipeline-info.model';


@Component({
  selector: 'app-analytical',
  templateUrl: './analytical.component.html',
  styleUrls: ['./analytical.component.css']
})
export class AnalyticalComponent implements OnInit {
  @Input() projectID;
  creatingPipeline = false;
  pipelines = [];
  pipelineInfo: PipelineInfoModel[];
  vbHelperPipeInfo: any;
  vbHelper: any;
  @Output() setPipelines: EventEmitter<any> = new EventEmitter<any>();

  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    this.getPipelineInfo();
  }

  /**
   * Calls the pipeline service to populate the "create pipeline" UI.
   */
  getPipelineInfo() {
    // Get all pipeline info
    this.pipelineService.getPipelines().subscribe(pipelines => {
      // Find vbhelper info
      this.vbHelperPipeInfo = pipelines.find(pipeline => {
        return pipeline.ptype === 'vbhelper';
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
    this.pipelineService.deletePipeline(pipeline.id).subscribe(() => {
      this.updateAvailablePipelineList();
    });
  }

  pipelineCreated(event): void {
    this.vbHelper = {...event};
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
    this.pipelineService.getProjectPipelines(this.projectID).subscribe((pipelines) => {
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
      project: this.projectID,
      description: 'new vbhelper created',
      type: 'vbhelper',
      name: 'vbhelper',
      metadata: {
        parameters: {},
        estimators: [],
        outer_cv: 'True'
      }
    };

    // Add default parameters vbHelperInfo
    this.vbHelperPipeInfo['hyper-parameters'].forEach(param => {
      this.vbHelper.metadata.parameters[`${param.name}`] = param.value;
    });

    // Stringify metadata
    this.vbHelper.metadata = JSON.stringify(this.vbHelper.metadata);

    // Add pipeline
    this.pipelineService.addPipeline(this.vbHelper).subscribe(() => {
      console.log(this.vbHelper);
    });
  }

  /**
   * Gets the list of estimators from vbHelper and updates UI.
   */
  updateAvailablePipelineList(): void {
    this.pipelines = JSON.parse(this.vbHelper.metadata.estimators.replace(/'/g, '"'));
    this.setPipelines.emit(this.pipelines);
  }
}
