import {Component, OnInit} from '@angular/core';
import {PipelineModel} from '../../../models/pipeline.model';
import {PipelineService} from '../../../services/pipeline.service';
import {ActivatedRoute} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-model-selection',
  templateUrl: './model-selection.component.html',
  styleUrls: ['./model-selection.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ModelSelectionComponent implements OnInit {

  projectID;
  pipelines: PipelineModel[];
  models = [];
  dataSource = [
    {
      Pipelines: 'elastic-net',
      count: 10
    },
    {
      Pipelines: 'rbf-svr-cv',
      count: 10
    },
    {
      Pipelines: 'lassolars',
      count: 10
    },
    {
      Pipelines: 'multi_pipe',
      count: 10
    }
  ];
  columnsToDisplay = ['Pipelines'];
  expandedElement: any | null;

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

