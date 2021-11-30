import { Component, OnInit } from '@angular/core';
import * as testCVData from '../../../../../test_data/dashboard_data/project_cv_results.json';

@Component({
  selector: 'app-dashpanel',
  templateUrl: './dashpanel.component.html',
  styleUrls: ['./dashpanel.component.css']
})
export class DashpanelComponent implements OnInit {

  PANEL_TYPES = ["data-table", "box-plot", "line-plot", "scatter-plot"]

  currentPanel = this.PANEL_TYPES[0];

  data;

  constructor() { }

  ngOnInit(): void {
    this.data = [];
    this.parseCVYvsYhat();
  }

  parseCVYvsYhat(): void {
    // Set Y
    let yArr = [];
    testCVData["default"].y.forEach(y => {
      yArr.push(y);
    });
    this.data.push({
      x: [...yArr],
      y: [...yArr],
      mode: 'markers',
      type: "scatter",
      name: "Y"
    });
    yArr = [];

    // Push all other results with y as x for each estimator
    for (let estimator in testCVData["default"].cv_yhat) {
      let yHat = [];
      for (let i = 0; i < testCVData["default"].cv_yhat[estimator].length; i++) {
        yArr = yArr.concat(testCVData["default"].y);
        yHat = yHat.concat(testCVData["default"].cv_yhat[estimator][i]);
      }
      this.data.push({
        x: [...yArr],
        y: [...yHat],
        mode: 'markers',
        marker: { size: 2 },
        visible: this.data.length == 1 ? "true" : "legendonly",
        type: "scatter",
        name: estimator
      });
    }

  }

  loadPanel(): void {
    console.log('load panel: ')
  }

}
