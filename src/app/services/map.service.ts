import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MapService {
  constructor() {}

  mapProperties: __esri.MapProperties = {
    basemap: "satellite",
  };

  mapViewProperties: __esri.MapViewProperties = {
    center: [-83.377319, 33.948006],
    zoom: 8,
  };

  getMapProperties() {
    return this.mapProperties;
  }

  getMapViewProperties() {
    return this.mapViewProperties;
  }
}
