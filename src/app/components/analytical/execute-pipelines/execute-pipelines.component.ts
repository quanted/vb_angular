import {Component, Input, OnInit} from '@angular/core';
import {PipelineService} from '../../../services/pipeline.service';
import {PipelineModel} from '../../../models/pipeline.model';

@Component({
  selector: 'app-execute-pipelines',
  templateUrl: './execute-pipelines.component.html',
  styleUrls: ['./execute-pipelines.component.css']
})
export class ExecutePipelinesComponent implements OnInit {

  @Input() pipelines: PipelineModel[];
  @Input() datasetID: number;

  constructor(
    private pipelineService: PipelineService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Function that executes the pipelines for a project.
   */
  execute(): void {
    this.pipelines.forEach(pipeline => {
      this.pipelineService.execute(pipeline, this.datasetID).subscribe();
    });
  }
}
