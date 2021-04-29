import { Component, OnInit } from '@angular/core';
import * as data from '../../../../../test_data/project_cv_results.json';

@Component({
  selector: 'app-model-graphs',
  templateUrl: './model-graphs.component.html',
  styleUrls: ['./model-graphs.component.css']
})
export class ModelGraphsComponent implements OnInit {

  public data: any;
  graphData = {
    x: [],
    y: []
  };
  constructor() { }

  ngOnInit(): void {
    this.data = data;
    this.graphData.x = [...Array(10)].map((_, i) => 1 + i);
    this.graphData.y = this.data.default.cv_score['elastic-net'].r2;
  }

  /**
   * Average across columns of arrays into a single array of averages.
   * @param dataArray
   */
  averageYHat(dataArray) {
    return dataArray.reduce((acc, cur) => {
      cur.forEach((e, i) => acc[i] = acc[i] ? acc[i] + e : e);
      return acc;
    }, []).map(e => e / dataArray.length);
  }
}
