import { Injectable } from "@angular/core";
import esri = __esri; // Esri TypeScript Types

import * as L from "leaflet";

@Injectable({
  providedIn: "root",
})
export class MapService {
  constructor() {}

  mapProperties: esri.MapProperties = {
    basemap: "streets",
  };

  mapViewProperties: esri.MapViewProperties = {
    center: [-83.377319, 33.948006],
    zoom: 8,
  };

  defaultTileSet = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "edupala.com © Angular LeafLet",
    }
  );

  getMapProperties(): esri.MapProperties {
    return this.mapProperties;
  }

  getMapViewProperties(): esri.MapViewProperties {
    return this.mapViewProperties;
  }

  getMapTileSet(set): L.tileLayer {
    switch (set) {
      default:
        return this.defaultTileSet;
    }
  }
}
