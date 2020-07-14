import { Component, OnInit } from "@angular/core";
import { EsriModuleProvider } from "angular-esri-components";
import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
  mapProperties;
  mapViewProperties;

  map: __esri.Map;
  mapView: __esri.MapView;

  constructor(
    private esriModule: EsriModuleProvider,
    private mapService: MapService
  ) {
    this.mapProperties = this.mapService.getMapProperties();
    this.mapViewProperties = this.mapService.getMapViewProperties();
  }

  ngOnInit() {}

  onMapInit(mapInfo: { map: __esri.Map; mapView: __esri.MapView }) {
    this.map = mapInfo.map;
    this.mapView = mapInfo.mapView;
  }
}
