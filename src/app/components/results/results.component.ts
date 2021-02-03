import { Component, OnInit } from '@angular/core';
import {PipelineService} from '../../services/pipeline.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(private analyticalService: PipelineService) { }

  ngOnInit() {
  }

}
