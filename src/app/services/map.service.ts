import { Injectable } from "@angular/core";

import * as L from "leaflet";

import { SettingsService } from "./settings.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MapService {
  map: L.map;
  markers = [];
  beachline = L.polyline;
  center = L.circle;
  waterLine = L.polyline;
  landLine = L.polyline;
  waterMarker = L.marker;
  landMarker = L.marker;

  markerChangeObserver;

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
  land = L.icon({
    iconUrl: "../assets/images/icon_land.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  });

  mapProperties: any = {
    basemap: "streets",
  };

  mapViewProperties: any = {
    center: [37.31, -92.1],
    zoom: 5,
  };

  constructor(private settings: SettingsService) {
    this.markerChangeObserver = new BehaviorSubject<any>(this.markers);
  }

  initMap(): void {
    this.map = L.map("map");
    this.map.on("click", (e) => {
      this.updateMarkers(e);
    });

    let testTileSet = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "edupala.com © Angular LeafLet",
      }
    );
    testTileSet.addTo(this.map);
    this.map.setView(
      this.mapViewProperties.center,
      this.mapViewProperties.zoom
    );
  }

  zoomTo(coords) {
    this.map.flyTo(coords);
  }

  getMapViewProperties(): any {
    return this.mapViewProperties;
  }

  getIcon(name): L.icon {
    switch (name) {
      case "flag":
        return this.flag;
      case "water":
        return this.water;
      case "land":
        return this.land;
      default:
        return this.flag;
    }
  }

  getMarkers() {
    return this.markers;
  }

  clearMarkers() {
    if (this.markers.length > 0) {
      for (const marker of this.markers) {
        this.map.removeLayer(marker);
      }
    }
    this.markers = [];
    this.drawBeachline();
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
        this.markerChangeObserver.next(this.markers);
        this.map.panTo(new L.LatLng(position.lat, position.lng));
      });
      this.map.addLayer(marker);
    }
    this.drawBeachline();
    this.markerChangeObserver.next(this.markers);
  }

  drawBeachline(): void {
    if (this.beachline) {
      this.map.removeLayer(this.beachline);
      this.map.removeLayer(this.center);
      this.map.removeLayer(this.waterLine);
      this.map.removeLayer(this.landLine);
      this.map.removeLayer(this.waterMarker);
      this.map.removeLayer(this.landMarker);
    }
    if (this.markers.length >= 2) {
      const beachEndpoints = [this.markers[0]._latlng, this.markers[1]._latlng];

      this.beachline = L.polyline(beachEndpoints, {
        color: this.settings.getColor("beachline"),
      }).addTo(this.map);
      // calculate and draw waterLine
      // calculate centerpoint of beachline
      const beachCenterpoint = {
        lat: (beachEndpoints[0].lat + beachEndpoints[1].lat) / 2,
        lng: (beachEndpoints[0].lng + beachEndpoints[1].lng) / 2,
      };
      // calculate radius of location circle
      const radius = Math.sqrt(
        (beachCenterpoint.lat - beachEndpoints[0].lat) *
          (beachCenterpoint.lat - beachEndpoints[0].lat) +
          (beachCenterpoint.lng - beachEndpoints[0].lng) *
            (beachCenterpoint.lng - beachEndpoints[0].lng)
      );

      const dy = beachEndpoints[1].lat - beachEndpoints[0].lat;
      const dx = beachEndpoints[1].lng - beachEndpoints[0].lng;
      const beachAngleRadians = Math.atan(dy / dx);
      let endX = beachCenterpoint.lat + radius * Math.cos(beachAngleRadians);
      let endY = beachCenterpoint.lng - radius * Math.sin(beachAngleRadians);
      const waterLineEnd = [endX, endY];
      let endX2 = beachCenterpoint.lat - radius * Math.cos(beachAngleRadians);
      let endY2 = beachCenterpoint.lng + radius * Math.sin(beachAngleRadians);
      const landLineEnd = [endX2, endY2];

      this.waterLine = L.polyline([beachCenterpoint, waterLineEnd], {
        color: "blue",
      }).addTo(this.map);

      this.landLine = L.polyline([beachCenterpoint, landLineEnd], {
        color: "green",
      }).addTo(this.map);

      this.waterMarker = L.marker(waterLineEnd, {
        icon: this.water,
      }).addTo(this.map);
      this.waterMarker.on("click", ($event) => {
        this.swapWaterAndLand($event);
      });
      this.markers[2] = this.waterMarker;

      this.landMarker = L.marker(landLineEnd, {
        icon: this.land,
      }).addTo(this.map);
      this.landMarker.on("click", ($event) => {
        this.swapWaterAndLand($event);
      });
      this.markers[3] = this.landMarker;

      this.center = L.circle(beachCenterpoint, {
        radius: radius,
        color: "red",
      }).addTo(this.map);
    }
  }

  swapWaterAndLand($event) {
    console.log("pre: ", this.markers);
    const waterCoords = this.markers[2]._latlng;
    const landCoords = this.markers[3]._latlng;
    console.log(waterCoords);
    console.log(landCoords);

    this.markers[2].setLatLng(new L.LatLng(landCoords.lat, landCoords.lng));
    this.markers[3].setLatLng(new L.LatLng(waterCoords.lat, waterCoords.lng));

    console.log("post: ", this.markers);
    this.drawBeachline();
    this.markerChangeObserver.next(this.markers);
  }
}
