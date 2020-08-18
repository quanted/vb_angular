import { Injectable } from "@angular/core";

import * as L from "leaflet";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class MapService {
  map: L.map;
  markers = [];
  beachline = L.polyline;
  center = L.circle;
  headingline = L.polyline;
  waterMarker = L.marker;

  flag = L.icon({
    iconUrl: "../assets/images/icon_flag.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  });
  water = L.icon({
    iconUrl: "../assets/images/icon_water.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  });
  wind = L.icon({
    iconUrl: "../assets/images/icon_wind.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  });

  mapProperties: any = {
    basemap: "streets",
  };

  mapViewProperties: any = {
    center: [33.948, -83.37731906],
    zoom: 8,
  };

  defaultTileSet = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "edupala.com © Angular LeafLet",
    }
  );

  constructor(private settings: SettingsService) {}

  initMap(): void {
    this.map = L.map("map").setView(
      this.mapViewProperties.center,
      this.mapViewProperties.zoom
    );
    this.map.on("click", (e) => {
      this.updateMarkers(e);
    });
    this.defaultTileSet.addTo(this.map);
  }

  getMapViewProperties(): any {
    return this.mapViewProperties;
  }

  getDefaultTileSet(): any {
    return this.defaultTileSet;
  }

  getIcon(name): L.icon {
    switch (name) {
      case "flag":
        return this.flag;
      case "water":
        return this.water;
      case "wind":
        return this.wind;
      default:
        return this.flag;
    }
  }
  updateMarkers($event): void {
    if (this.markers.length < 2) {
      const marker = new L.marker($event.latlng, {
        icon: this.flag,
        draggable: "true",
      });
      this.markers[this.markers.length] = marker;
      marker.on("dragend", ($event) => {
        const marker = $event.target;
        const position = marker.getLatLng();
        marker.setLatLng(new L.LatLng(position.lat, position.lng), {
          draggable: "true",
        });
        this.drawBeachline();
        this.map.panTo(new L.LatLng(position.lat, position.lng));
      });
      this.map.addLayer(marker);
    }
    this.drawBeachline();
  }

  drawBeachline(): void {
    if (this.markers.length === 2) {
      const latlngs = [this.markers[0]._latlng, this.markers[1]._latlng];
      if (this.beachline) {
        this.map.removeLayer(this.beachline);
        this.map.removeLayer(this.center);
        this.map.removeLayer(this.headingline);
        this.map.removeLayer(this.waterMarker);
      }
      this.beachline = L.polyline(latlngs, {
        color: this.settings.getColor("beachline"),
      }).addTo(this.map);
      // calculate and draw headingline
      // calculate centerpoint of beachline
      const headinglineStart = [
        (latlngs[0].lat + latlngs[1].lat) / 2,
        (latlngs[0].lng + latlngs[1].lng) / 2,
      ];
      // calculate radius of location circle
      const radius = Math.sqrt(
        (headinglineStart[0] - latlngs[0].lat) *
          (headinglineStart[0] - latlngs[0].lat) +
          (headinglineStart[1] - latlngs[0].lng) *
            (headinglineStart[1] - latlngs[0].lng)
      );
      const latDiff = headinglineStart[0] - latlngs[0].lat;
      const lngDiff = headinglineStart[1] - latlngs[0].lng;

      let endX = headinglineStart[0] + latDiff;
      let endY = headinglineStart[1] + -lngDiff;

      const headinglineEnd = [endX, endY];
      this.headingline = L.polyline([headinglineStart, headinglineEnd], {
        color: "blue",
      }).addTo(this.map);

      this.waterMarker = L.marker(headinglineEnd, {
        icon: this.water,
      }).addTo(this.map);

      this.center = L.circle(headinglineStart, {
        radius: 2000,
        color: "red",
      }).addTo(this.map);
    }
  }
}
