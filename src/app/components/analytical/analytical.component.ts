import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PipelineModel} from '../../models/pipeline.model';
import {ProjectModel} from '../../models/project.model';


@Component({
  selector: 'app-analytical',
  templateUrl: './analytical.component.html',
  styleUrls: ['./analytical.component.css']
})
export class AnalyticalComponent implements OnInit, OnChanges {

  // State management variable for displaying create model component or
  // pipelines already created component.
  createModel: boolean;
  // Current project passed down from parent.
  @Input() project: ProjectModel;
  // @Input to the execute pipelines component
  pipelines: PipelineModel[];
  // @Input to the execute pipelines component
  datasetID: number;

  constructor() { this.createModel = false; }

  ngOnInit(): void {}

  /**
   * Check for changes on @Input elements and update them.
   * @param changes - Tracks input changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.project) {
      this.setDatasetID();
    }
  }

  /**
   * Handle message emitted from @Output in child component.
   * Update create model state variable.
   */
  receiveMessage(): void {
      this.createModel = false;
  }

  /**
   * Handle message emitted from @Output in child component.
   * @param pipelines - An array of pipelines.
   */
  getPipelines(pipelines: PipelineModel[]) {
    this.pipelines = pipelines;
  }

  /**
   * Set the dataset id to be passed to child component.
   */
  setDatasetID() {
    this.datasetID = this.project?.dataset;
  }
}
