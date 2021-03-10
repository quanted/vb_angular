import {Component, OnInit} from '@angular/core';
import {PipelineModel} from '../../../models/pipeline.model';
import {PipelineService} from '../../../services/pipeline.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-model-selection',
  templateUrl: './model-selection.component.html',
  styleUrls: ['./model-selection.component.css']
})
export class ModelSelectionComponent implements OnInit {

  projectID;
  pipelines: PipelineModel[];
  models = [];

  constructor(
    private route: ActivatedRoute,
    private pipelineService: PipelineService
  ) { }

  ngOnInit(): void {
    this.projectID = this.route.snapshot.paramMap.get('id');
    this.getAvailablePipelineList();
  }

  getPipelineModels() {
    this.pipelines.forEach(pipeline => {
      this.pipelineService.getPipelineStatus(this.projectID, pipeline.id).subscribe( models => {
        this.models.push(models.models);
      });
    });
  }

  getAvailablePipelineList(): void {
    this.pipelineService.getProjectPipelines(this.projectID).subscribe((pipelines) => {
      this.pipelines = [...pipelines];
      this.getPipelineModels();
    });
  }
}
