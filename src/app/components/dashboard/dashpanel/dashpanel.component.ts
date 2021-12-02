import { Component, OnInit } from '@angular/core';
import * as testCVData from '../../../../../test_data/dashboard_data/project_cv_results.json';

@Component({
  selector: 'app-dashpanel',
  templateUrl: './dashpanel.component.html',
  styleUrls: ['./dashpanel.component.css']
})
export class DashpanelComponent implements OnInit {

  PANEL_TYPES: {
    title: string,
    xAxisTitle: string,
    yAxisTitle: string
  }[] = [{
    title: "Y vs. CV Test YHat",
    xAxisTitle: "Observed Y",
    yAxisTitle: "Predicted Y"
  }, {
    title: "Negative Mean Squared Error",
    xAxisTitle: "",
    yAxisTitle: ""
  }]

  currentPanel = this.PANEL_TYPES[0];

  data: any;
  plotTitle: string;
  xAxisTitle: string;
  yAxisTitle: string;
  nTicks: number;
  decisionCriteria: number;
  regulatoryStandard: number;

  constructor() { }

  ngOnInit(): void {
    this.plotTitle = this.PANEL_TYPES[0].title;
    this.xAxisTitle = this.PANEL_TYPES[0].xAxisTitle;
    this.yAxisTitle = this.PANEL_TYPES[0].yAxisTitle;
    this.parseCVYvsYhat();
  }

  parseCVYvsYhat(): void {
    this.data = [];
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
    const min = Math.min(...yArr);
    const max = Math.max(...yArr);
    let yMax = Math.max(...yArr);
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
      if (yMax < Math.max(...yHat)) {
        yMax = Math.max(...yHat);
      }
    }

    // Add Decision Criteria
    let decisionCriteria = 500;
    this.data.push({
      x: [decisionCriteria, decisionCriteria],
      y: [0, yMax],
      mode: 'lines',
      line: { color: 'red' },
      type: "scatter",
      name: "Decision Criteria",
      hoverinfo: 'none'
    });

    // Add Regulatory Standard
    let standard = 500;
    this.data.push({
      x: [min, max],
      y: [standard, standard],
      mode: 'lines',
      line: { color: 'green' },
      type: "scatter",
      name: "Regulatory Standard",
      hoverinfo: 'none'
    });
    this.nTicks = 0;
  }

  parseNegativeMeanSquaredError(panel: any): void {
    // Push all other results with y as x for each estimator
    let x = [];
    for (let estimator in testCVData["default"].cv_score) {
      // Set x values
      if (x.length == 0) {
        for (let i = 0; i < testCVData["default"].cv_score[estimator]["neg_mean_squared_error"].length; i++) {
          x.push(i);
        }
      }

      // Set y values
      let y = [...testCVData["default"].cv_score[estimator]["neg_mean_squared_error"]];

      this.data.push({
        x: [...x],
        y: [...y],
        mode: 'lines',
        marker: { size: 2 },
        visible: this.data.length == 0 ? "true" : "legendonly",
        type: "scatter",
        name: estimator
      });
      this.plotTitle = panel.title;
      this.xAxisTitle = panel.xAxisTitle;
      this.yAxisTitle = panel.yAxisTitle;
      this.nTicks = x.length;
    }
  }

  loadPanel(e): void {
    this.data = [];
    switch (e.target.value) {
      case "Y vs. CV Test YHat":
        this.parseCVYvsYhat();
        break;
      case "Negative Mean Squared Error":
        this.parseNegativeMeanSquaredError(this.PANEL_TYPES[1]);
        break;
      default:
        break;
    }
  }

  decisionCriteriaChange(e) {

  }
}
