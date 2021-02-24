import {Component, Input, OnInit} from '@angular/core';
import {PipelineModel} from '../../../models/pipeline.model';
import {PipelineService} from '../../../services/pipeline.service';

@Component({
  selector: 'app-model-selection',
  templateUrl: './model-selection.component.html',
  styleUrls: ['./model-selection.component.css']
})
export class ModelSelectionComponent implements OnInit {

  @Input() pipelines: PipelineModel[];
  // TODO: get list of models to be selected for prediction?

  constructor(
    private pipelineService: PipelineService
  ) { }

  ngOnInit(): void {
  }

  getPipelineModels() {

  }

}
