import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../../services/dashboard.service';

@Component({
  selector: 'app-model-graphs',
  templateUrl: './model-graphs.component.html',
  styleUrls: ['./model-graphs.component.css']
})
export class ModelGraphsComponent implements OnInit {

  data: any;
  chartType = 'line';
  chartValue = 'score';
  selected = 'negMeanAbsoluteError';

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.setData();
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

  setData() {
    this.data = this.dashboardService[this.selected];
  }
}
