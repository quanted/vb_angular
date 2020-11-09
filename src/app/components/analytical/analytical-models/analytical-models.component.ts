import { Component, OnInit } from '@angular/core';
import { AnalyticalModelService } from '../../../services/analyticalmodel.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-analytical-models',
  templateUrl: './analytical-models.component.html',
  styleUrls: ['./analytical-models.component.css']
})
export class AnalyticalModelsComponent implements OnInit {

  models : Observable<any>;

  constructor(
    private analyticalModelService : AnalyticalModelService
  ) { }

  ngOnInit(): void {
    this.models = this.analyticalModelService.getModels();
    console.log(this.models);
  }

}
