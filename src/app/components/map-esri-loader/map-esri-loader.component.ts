import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { loadModules } from "esri-loader";
import esri = __esri; // Esri TypeScript Types
import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-map-esri-loader",
  templateUrl: "./map-esri-loader.component.html",
  styleUrls: ["./map-esri-loader.component.css"],
})
export class MapEsriLoaderComponent implements OnInit, OnDestroy {
  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  // Set our map properties
  map: __esri.Map;
  mapProperties: esri.MapProperties;
  mapView: __esri.MapView;
  mapViewProperties: esri.MapViewProperties;

  constructor(private mapService: MapService) {
    this.mapProperties = this.mapService.getMapProperties();
    this.mapViewProperties = this.mapService.getMapViewProperties();

    this.initializeMap().then((mapView) => {
      // The map has been initialized
      console.log("mapView ready: ", mapView.ready);
    });
  }

  ngOnInit() {}

  // creates a new esri.MapView and assigns it to this.mapView
  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
      ]);

      this.map = new EsriMap(this.mapProperties);

      // Initialize the MapView
      this.mapViewProperties = {
        container: this.mapViewEl.nativeElement,
      };

      this.mapView = new EsriMapView(this.mapViewProperties);
      await this.mapView.when();
      return this.mapView;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnDestroy() {
    if (this.mapView) {
      // destroy the map view
      this.mapView.container = null;
    }
  }
}
