import { Component, OnInit } from "@angular/core";

import * as L from "leaflet";

import { MapService } from "src/app/services/map.service";
import { SettingsService } from "src/app/services/settings.service";

@Component({
  selector: "app-map-leaflet",
  templateUrl: "./map-leaflet.component.html",
  styleUrls: ["./map-leaflet.component.css"],
})
export class MapLeafletComponent implements OnInit {
  title = "leafletApps";
  map: L.Map;

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

  heading = 0.0;

  constructor(
    private mapService: MapService,
    private settings: SettingsService
  ) {}

  ngOnInit() {
    const viewProps = this.mapService.getMapViewProperties();
    this.map = L.map("map").setView(
      [viewProps.center[1], viewProps.center[0]],
      viewProps.zoom
    );
    this.map.on("click", (e) => {
      this.updateMarkers(e);
    });
    this.mapService.getMapTileSet("default").addTo(this.map);
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
      let endY = headinglineStart[1] + -(lngDiff);

      const headinglineEnd = [endX, endY];
      this.headingline = L.polyline([headinglineStart, headinglineEnd], {
        color: "blue",
      }).addTo(this.map);

      this.waterMarker = L.marker(headinglineEnd, {icon: this.water}).addTo(this.map);

      this.center = L.circle(headinglineStart, {
        radius: 2000,
        color: "red",
      }).addTo(this.map);
    }
  }
}
