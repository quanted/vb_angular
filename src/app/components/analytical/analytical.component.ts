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
  cvPipe: PipelineInfoModel;
  @Output() setPipelines: EventEmitter<any> = new EventEmitter<any>();

  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    this.getPipelineInfo();
    this.updateAvailablePipelineList();
  }

  /**
   * Calls the pipeline service to populate the "create pipeline" UI.
   */
  getPipelineInfo() {
    this.pipelineService.getPipelines().subscribe(pipelines => {
      this.cvPipe = pipelines.find(pipeline => {
        return pipeline.ptype === 'vbhelper';
      });
      const index = pipelines.indexOf(this.cvPipe);
      pipelines.splice(index, 1);
      this.pipelineInfo = pipelines;
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

  pipelineCreated(): void {
    this.creatingPipeline = false;
    this.updateAvailablePipelineList();
  }

  pipelineCancelled(): void {
    this.creatingPipeline = false;
  }

  updateAvailablePipelineList(): void {
    this.pipelineService.getProjectPipelines(this.projectID).subscribe((pipelines) => {
      this.pipelines = [...pipelines];
      this.setPipelines.emit(this.pipelines);
    });
  }
}
