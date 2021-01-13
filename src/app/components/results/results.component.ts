import { Component, OnInit } from '@angular/core';
import {AnalyticalModelService} from '../../services/analyticalmodel.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(private analyticalService: AnalyticalModelService) { }

  ngOnInit() {
  }

}
