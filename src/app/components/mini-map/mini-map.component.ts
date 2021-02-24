import { Component, Input, OnInit } from '@angular/core';

import { MiniMapService } from 'src/app/services/mini-map.service';
import { LocationData } from 'src/app/models/location-data';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements OnInit {

  constructor(private minimapService: MiniMapService, private mapService: MapService) { }

  @Input() location: LocationData;

  ngOnInit(): void {
    // this.mapService.initMap();
  }
}
