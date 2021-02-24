import { Injectable } from '@angular/core';

import { LocationData } from '../models/location-data';

@Injectable({
  providedIn: 'root'
})
export class MiniMapService {
  minimap;

  constructor() { }

  initMap(location: LocationData) {
    console.log("minimapSVC: ", location);
    // this.minimap = L.map("mini-map").setView([40.744996, -73.983761], 16);
    // let testTileSet = L.tileLayer(
    //   "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    //   {
    //     attribution: "edupala.com © Angular LeafLet",
    //   }
    // );
    // testTileSet.addTo(this.minimap);
    // this.minimap.setView(
    // );
  }
}
