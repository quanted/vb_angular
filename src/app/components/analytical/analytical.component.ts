import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { PipelineService } from 'src/app/services/pipeline.service';
import {PipelineModel} from '../../models/pipeline.model';
import {ProjectModel} from '../../models/project.model';


@Component({
  selector: 'app-analytical',
  templateUrl: './analytical.component.html',
  styleUrls: ['./analytical.component.css']
})
export class AnalyticalComponent implements OnInit {
  @Input() projectID;
  creatingPipeline = false;

  pipelines = [];
  selectedPipelines = [];
  @Output() setPipelines: EventEmitter<any> = new EventEmitter<any>();

  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    this.updateAvailablePipelineList();
  }

  createPipeline(): void {
    this.creatingPipeline = true;
  }

  deletePipeline(pipeline): void {
    this.pipelineService.deletePipeline(pipeline.id).subscribe(() => {
      this.updateAvailablePipelineList();
    })
  }

  pipelineCreated(): void {
    this.creatingPipeline = false;
    this.updateAvailablePipelineList();
  }

  updateAvailablePipelineList(): void {
    this.pipelineService.getProjectPipelines(this.projectID).subscribe((pipelines) => {
      this.pipelines = [...pipelines];
      this.setPipelines.emit(this.pipelines);
    })
  }

  // // State management variable for displaying create model component or
  // // pipelines already created component.
  // createModel: boolean;
  // // Current project passed down from parent.
  // @Input() project: ProjectModel;
  // // @Input to the execute pipelines component
  // pipelines: PipelineModel[];
  // // @Input to the execute pipelines component
  // datasetID: number;

  // constructor() { this.createModel = false; }

  // ngOnInit(): void {}

  // /**
  //  * Check for changes on @Input elements and update them.
  //  * @param changes - Tracks input changes.
  //  */
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.project) {
  //     this.setDatasetID();
  //   }
  // }

  // /**
  //  * Handle message emitted from @Output in child component.
  //  * Update create model state variable.
  //  */
  // receiveMessage(): void {
  //     this.createModel = false;
  // }

  // /**
  //  * Handle message emitted from @Output in child component.
  //  * @param pipelines - An array of pipelines.
  //  */
  // getPipelines(pipelines: PipelineModel[]) {
  //   this.pipelines = pipelines;
  // }

  // /**
  //  * Set the dataset id to be passed to child component.
  //  */
  // setDatasetID() {
  //   this.datasetID = this.project?.dataset;
  // }
}
