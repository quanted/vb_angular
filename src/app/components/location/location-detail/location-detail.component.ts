import { Component, Input, OnInit } from '@angular/core';

import { LocationData } from 'src/app/models/location-data';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})
export class LocationDetailComponent implements OnInit {

  constructor() {}

  @Input() location: LocationData;

  ngOnInit(): void {
  }
}
