import { Injectable } from "@angular/core";

import * as L from "leaflet";

import { SettingsService } from "./settings.service";
import { BehaviorSubject } from "rxjs";
import { LocationService } from "./location.service";

@Injectable({
  providedIn: "root",
})
export class MapService {
  map: L.map;
  markers = [];
  beachIndicator: L.layerGroup;
  flipBeach = false;

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
    this.map.on("click", ($event) => {
      this.addMarker($event);
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

  addMarker($event): void {
    if (this.markers.length < 2) {
      const marker = new L.marker($event.latlng, {
        icon: this.flag,
        draggable: "true",
      });
      marker.on("dragend", ($event) => {
        const marker = $event.target;
        const position = marker.getLatLng();
        marker.setLatLng(new L.LatLng(position.lat, position.lng), {
          draggable: "true",
        });
        this.updateBeachIndicator();
      });
      marker.addTo(this.map);
      this.markers[this.markers.length] = marker;
      this.updateBeachIndicator();
    }
  }

  updateBeachIndicator(): void {
    if (this.map.hasLayer(this.beachIndicator)) {
      this.map.removeLayer(this.beachIndicator);
    }
    if (this.markers.length >= 2) {
      this.drawBeachIndicator();
    }
    this.markerChangeObserver.next(this.markers);
  }

  drawBeachIndicator(): void {
    this.beachIndicator = L.layerGroup();
    const beachEndpoints = [this.markers[0]._latlng, this.markers[1]._latlng];

    L.polyline(beachEndpoints, {
      color: this.settings.getColor("beachline"),
    }).addTo(this.beachIndicator);
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
    let endX2 = beachCenterpoint.lat - radius * Math.cos(beachAngleRadians);
    let endY2 = beachCenterpoint.lng + radius * Math.sin(beachAngleRadians);
    const waterLineEnd = this.flipBeach ? [endX, endY] : [endX2, endY2];
    const landLineEnd = this.flipBeach ? [endX2, endY2] : [endX, endY];

    L.polyline([beachCenterpoint, waterLineEnd], {
      color: "blue",
    }).addTo(this.beachIndicator);

    L.polyline([beachCenterpoint, landLineEnd], {
      color: "green",
    }).addTo(this.beachIndicator);

    const waterMarker = L.marker(waterLineEnd, {
      icon: this.water,
    }).addTo(this.beachIndicator);
    waterMarker.on("click", ($event) => {
      this.swapWaterAndLand();
    });
    this.markers[2] = waterMarker;

    const landMarker = L.marker(landLineEnd, {
      icon: this.land,
    }).addTo(this.beachIndicator);
    landMarker.on("click", ($event) => {
      this.swapWaterAndLand();
    });
    this.markers[3] = landMarker;

    L.circle(beachCenterpoint, {
      radius: 2000,
      color: "red",
    }).addTo(this.beachIndicator);

    this.beachIndicator.addTo(this.map);
  }

  swapWaterAndLand() {
    this.flipBeach = !this.flipBeach;
    this.updateBeachIndicator();
  }

  clearMarkers() {
    if (this.markers.length > 0) {
      for (const marker of this.markers) {
        this.map.removeLayer(marker);
      }
    }
    this.markers = [];
    if (this.beachIndicator !== undefined) {
      this.map.removeLayer(this.beachIndicator);
    }
  }

  flyTo(coords) {
    this.map.flyTo(coords);
  }
}
