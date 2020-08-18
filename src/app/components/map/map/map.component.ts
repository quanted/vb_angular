import { Component, OnInit } from "@angular/core";

import * as L from "leaflet";

import { MapService } from "src/app/services/map.service";
import { SettingsService } from "src/app/services/settings.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
  title = "leafletApps";

  heading = 0.0;

  constructor(
    private mapService: MapService,
    private settings: SettingsService
  ) {}

  ngOnInit() {
    this.mapService.initMap();
  }
}
