import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { MapService } from "src/app/services/map.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  projectID;

  constructor(
    private route: ActivatedRoute,
    private mapService: MapService
  ) {}

  ngOnInit() {
    if(this.route.paramMap) {
      this.projectID = this.route.snapshot.paramMap.get('id');
    }
    this.mapService.initMap();
  }
}
