import { Component, Input, OnInit } from '@angular/core';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-data-detail',
  templateUrl: './data-detail.component.html',
  styleUrls: ['./data-detail.component.css']
})
export class DataDetailComponent implements OnInit {

  @Input() dataset;

  constructor(private datasetService: DatasetService) { }

  ngOnInit(): void {
  }

}
