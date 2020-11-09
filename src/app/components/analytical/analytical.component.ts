import { Component, OnInit } from '@angular/core';
import { AnalyticalModelService } from '../../services/analyticalmodel.service';

@Component({
  selector: 'app-analytical',
  templateUrl: './analytical.component.html',
  styleUrls: ['./analytical.component.css']
})
export class AnalyticalComponent implements OnInit {

  selectedModel : string;

  constructor() {}

  ngOnInit() {}

}
