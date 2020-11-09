import { Component, OnInit } from '@angular/core';
import { AnalyticalModelService } from '../../../services/analyticalmodel.service';
import { AnalyticalModelResponse } from '../../../models/analytical-model-response';
import { mockModel } from '../../../models/analytical-model-response';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-analytical-models',
  templateUrl: './analytical-models.component.html',
  styleUrls: ['./analytical-models.component.css']
})
export class AnalyticalModelsComponent implements OnInit {

  models : Observable<AnalyticalModelResponse[]>;
  mock : AnalyticalModelResponse[] = [mockModel];

  displayedColumns: string[] = [
    'project', 
    'name', 
    'type', 
    'description', 
    'variables', 
    'model'
  ];

  constructor(
    private analyticalModelService : AnalyticalModelService
  ) { }

  ngOnInit(): void {
    this.models = this.analyticalModelService.getModels();
    console.log(this.models);
  }

}
