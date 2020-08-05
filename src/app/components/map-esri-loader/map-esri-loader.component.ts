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
export class MapEsriLoaderComponent implements OnInit {
  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  _loaded = false;
  mapView: esri.MapView = null;

  map: esri.Map;
  mapProperties: esri.MapProperties;
  mapViewProperties: esri.MapViewProperties;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  constructor(private mapService: MapService) {}

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
      ]);

      // Configure the Map
      this.map = new EsriMap(this.mapProperties);

      // Initialize the MapView
      this.mapViewProperties.map = this.map;

      this.mapView = new EsriMapView(this.mapViewProperties);
      await this.mapView.when();
      // this._view.ui.empty();
      return this.mapView;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit() {
    this.mapProperties = this.mapService.getMapProperties();
    this.mapViewProperties = this.mapService.getMapViewProperties();
    this.mapViewProperties.container = this.mapViewEl.nativeElement;
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then((mapView) => {
      // The map has been initialized
      console.log("mapView ready: ", this.mapView.ready);
      this._loaded = this.mapView.ready;
    });
  }

  // ngOnDestroy() {
  //   if (this.mapView) {
  //     // destroy the map view
  //     this.mapView.container = null;
  //   }
  // }
}
