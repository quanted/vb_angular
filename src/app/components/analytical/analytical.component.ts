import {AfterViewInit, Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-analytical',
  templateUrl: './analytical.component.html',
  styleUrls: ['./analytical.component.css']
})
export class AnalyticalComponent implements OnInit, AfterViewInit {

  createModel: boolean;

  constructor() { this.createModel = false; }

  ngOnInit(): void {}
  ngAfterViewInit(): void {}

  receiveMessage(model): void {
      this.createModel = false;
  }
}
