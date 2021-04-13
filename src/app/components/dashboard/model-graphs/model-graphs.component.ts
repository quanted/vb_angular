import { Component, OnInit } from '@angular/core';
import * as data from '../../../../../test_data/projec_cv_results.json';

@Component({
  selector: 'app-model-graphs',
  templateUrl: './model-graphs.component.html',
  styleUrls: ['./model-graphs.component.css']
})
export class ModelGraphsComponent implements OnInit {

  public data: any;
  public loop;
  constructor() { }

  ngOnInit(): void {
    this.loop = new Array(4);
    this.data = data.cv_score?.['elastic-net'].neg_mean_absolute_error;
  }

}
