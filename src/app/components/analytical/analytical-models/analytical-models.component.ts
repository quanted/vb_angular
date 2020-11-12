import { Component, OnInit } from '@angular/core';
import { AnalyticalModelService } from '../../../services/analyticalmodel.service';
import { AnalyticalModelResponse } from '../../../models/analytical-model-response';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-analytical-models',
  templateUrl: './analytical-models.component.html',
  styleUrls: ['./analytical-models.component.css']
})
export class AnalyticalModelsComponent implements OnInit {

  models : AnalyticalModelResponse[];

  displayedColumns: string[] = [
    'project', 
    'name', 
    'type', 
    'description', 
    'variables', 
    'model'
  ];

  constructor(
    private route : ActivatedRoute,
    private analyticalModelService : AnalyticalModelService,
  ) { }

  ngOnInit(): void {
    this.getModels(this.route.snapshot.paramMap.get('id'));
  }

  getModels(projectID : string) {
    if(projectID === "undefined" || projectID === "null") {
      console.log("No project ID");
      return;
    } else {
      this.analyticalModelService.getModels(projectID).subscribe(model => {
        this.models = model;
      });
    }
  }
}
