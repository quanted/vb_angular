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
    yAxisTitle: string,
  }[] = [{
    title: "Y vs. CV Test YHat",
    xAxisTitle: "Observed Y",
    yAxisTitle: "Predicted Y"
  }, {
    title: "Negative Mean Squared Error",
    xAxisTitle: "Repetitions",
    yAxisTitle: ""
  }, {
    title: "Negative Mean Absolute Error",
    xAxisTitle: "Repetitions",
    yAxisTitle: ""
  }, {
    title: "R2",
    xAxisTitle: "Repetitions",
    yAxisTitle: ""
  }]
  chart = this.PANEL_TYPES[0];

  CHART_TYPES: string[] = [
    "Scatter",
    "Box",
  ]

  chartType: string = this.CHART_TYPES[0];

  data: any[];
  plotTitle: string;
  xAxisTitle: string;
  yAxisTitle: string;
  nTicks: number;
  xAxisType: string;
  decisionCriteria: number = 500;
  regulatoryStandard: number = 500;

  constructor() { }

  ngOnInit(): void {
    this.parseCVYvsYhat(this.PANEL_TYPES[0]);
  }

  parseCVYvsYhat(panel: any): void {
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
    this.decisionCriteria = (min + max) / 2;
    this.regulatoryStandard = this.decisionCriteria;
    let yMax = max;
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
    this.data.push({
      x: [this.decisionCriteria, this.decisionCriteria],
      y: [0, yMax],
      mode: 'lines',
      line: { color: 'red' },
      type: "scatter",
      name: "Decision Criteria",
      hoverinfo: 'none'
    });

    // Add Regulatory Standard
    this.data.push({
      x: [min, max],
      y: [this.regulatoryStandard, this.regulatoryStandard],
      mode: 'lines',
      line: { color: 'green' },
      type: "scatter",
      name: "Regulatory Standard",
      hoverinfo: 'none'
    });
    this.nTicks = 0;
    this.plotTitle = panel.title;
    this.xAxisTitle = panel.xAxisTitle;
    this.xAxisType = "linear";
    this.yAxisTitle = panel.yAxisTitle;
  }

  parseCVError(panel: any, cv: string): void {
    // Push all other results with y as x for each estimator
    let x = [];
    for (let estimator in testCVData["default"].cv_score) {
      // Set y values
      let y = [...testCVData["default"].cv_score[estimator][cv]];
      let x = [];
      for (let i = 0; i < y.length; i++) {
        x.push(this.chartType == "Scatter" ? i : estimator);
      }

      this.data.push({
        x: [...x],
        y: [...y],
        mode: 'lines',
        marker: { size: 2 },
        visible: "true",
        type: this.chartType.toLowerCase(),
        name: estimator
      });
      this.plotTitle = panel.title;
      this.xAxisTitle = this.chartType == "Box" ? "Estimators" : panel.xAxisTitle;
      this.yAxisTitle = panel.yAxisTitle;
      this.nTicks = this.chartType == "Box" ? 0 : x.length;
      this.xAxisType = this.chartType == "Box" ? "category" : "linear";
    }
  }

  decisionCriteriaChange(e) {
    this.data.filter(d => d.name == "Decision Criteria")[0].x = [e.target.value, e.target.value];
    this.data = [...this.data];
  }

  regulatoryStandardChange(e) {
    this.data.filter(d => d.name == "Regulatory Standard")[0].y = [e.target.value, e.target.value];
    this.data = [...this.data];
  }

  loadPanel(e): void {
    this.data = [];
    switch (this.chart.title) {
      case "Y vs. CV Test YHat":
        this.parseCVYvsYhat(this.PANEL_TYPES[0]);
        break;
      case "Negative Mean Squared Error":
        this.parseCVError(this.PANEL_TYPES[1], "neg_mean_squared_error");
        break;
      case "Negative Mean Absolute Error":
        this.parseCVError(this.PANEL_TYPES[2], "neg_mean_absolute_error");
        break;
      case "R2":
        this.parseCVError(this.PANEL_TYPES[3], "r2");
        break;
      default:
        break;
    }
  }
}

