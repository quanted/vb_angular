import { Component, OnInit } from "@angular/core";
import { EsriModuleProvider } from "angular-esri-components";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
  mapProperties: __esri.MapProperties = {
    basemap: "dark-gray",
  };

  mapViewProperties: __esri.MapViewProperties = {
    center: [-83.377319, 33.948006],
    zoom: 8,
  };

  map: __esri.Map;
  mapView: __esri.MapView;

  constructor(private esriModule: EsriModuleProvider) {}

  ngOnInit() {}

  onMapInit(mapInfo: { map: __esri.Map; mapView: __esri.MapView }) {
    this.map = mapInfo.map;
    this.mapView = mapInfo.mapView;
  }
}
