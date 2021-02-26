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
    });
  }

  pipelineCreated(): void {
    this.creatingPipeline = false;
    this.updateAvailablePipelineList();
  }

  updateAvailablePipelineList(): void {
    this.pipelineService.getProjectPipelines(this.projectID).subscribe((pipelines) => {
      this.pipelines = [...pipelines];
      this.setPipelines.emit(this.pipelines);
    });
  }
}
