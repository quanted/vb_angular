import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CreateModelComponent} from './create-model/create-model.component';
import {AnalyticalModelsComponent} from './analytical-models/analytical-models.component';
import {utf8Encode} from '@angular/compiler/src/util';

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
