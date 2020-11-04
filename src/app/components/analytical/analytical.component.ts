import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytical',
  templateUrl: './analytical.component.html',
  styleUrls: ['./analytical.component.css']
})
export class AnalyticalComponent implements OnInit {

  // List of model types
  models : string[] = [
    "Mean Linear Regression", 
    "Gradient Boosting Machine", 
    "Partial Least Squares"
  ];

  selectedModel : string;

  constructor() {}

  ngOnInit() {}

}
