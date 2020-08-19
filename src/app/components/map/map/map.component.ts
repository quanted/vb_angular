import { Component, OnInit } from "@angular/core";

import * as L from "leaflet";

import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.mapService.initMap();
  }
}
