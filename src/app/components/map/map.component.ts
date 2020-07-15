import { Component, OnInit } from "@angular/core";
import { EsriModuleProvider } from "angular-esri-components";
import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
  mapProperties;
  mapViewProperties;

  map: __esri.Map;
  mapView: __esri.MapView;

  constructor(
    private esriModuleProvider: EsriModuleProvider,
    private mapService: MapService
  ) {
    this.mapProperties = this.mapService.getMapProperties();
    this.mapViewProperties = this.mapService.getMapViewProperties();
  }

  ngOnInit() {}

  onMapInit(mapInfo: { map: __esri.Map; mapView: __esri.MapView }) {
    this.map = mapInfo.map;
    this.mapView = mapInfo.mapView;

    this.mapView.on("click", (event) => {
      this.handleMapClick(event);
    });

    this.addMapImageLayer();
  }

  handleMapClick(event) {
    console.log(event);

    this.mapView.popup.open({
      title: "VB Web",
      content: `Latitude: ${event.mapPoint.latitude} Longitude ${event.mapPoint.longitude}`,
      location: event.mapPoint,
    });
  }

  addMapImageLayer() {
    this.esriModuleProvider
      .require(["esri/layers/MapImageLayer"])
      .then(([MapImageLayer]) => {
        const layer = new MapImageLayer({
          url:
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
          sublayers: [
            {
              id: 3,
              title: "States",
              visible: false,
            },
            {
              id: 2,
              title: "Railroads",
              visible: true,
            },
            {
              id: 1,
              title: "Highways",
              visible: true,
            },
            {
              id: 0,
              title: "Cities",
              visible: true,
            },
          ],
        });

        this.map.layers.add(layer);
      });
  }

  // this one 404's on require load,
  // using wrong path to get file from arcgis
  addGeoJsonLayer() {
    this.esriModuleProvider
      .require(["esri/layers/GeoJSONLayer"])
      .then(([GeoJSONLayer]) => {
        // If GeoJSON files are not on the same domain as your website, a CORS enabled server
        // or a proxy is required.
        const url =
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

        // Paste the url into a browser's address bar to download and view the attributes
        // in the GeoJSON file. These attributes include:
        // * mag - magnitude
        // * type - earthquake or other event such as nuclear test
        // * place - location of the event
        // * time - the time of the event
        // Use the Arcade Date() function to format time field into a human-readable format

        const template = {
          title: "Earthquake Info",
          content: "Magnitude {mag} {type} hit {place} on {time}",
          fieldInfos: [
            {
              fieldName: "time",
              format: {
                dateFormat: "short-date-short-time",
              },
            },
          ],
        };

        const renderer = {
          type: "simple",
          field: "mag",
          symbol: {
            type: "simple-marker",
            color: "orange",
            outline: {
              color: "white",
            },
          },
          visualVariables: [
            {
              type: "size",
              field: "mag",
              stops: [
                {
                  value: 2.5,
                  size: "4px",
                },
                {
                  value: 8,
                  size: "40px",
                },
              ],
            },
          ],
        };

        const geojsonLayer = new GeoJSONLayer({
          url: url,
          copyright: "USGS Earthquakes",
          popupTemplate: template,
          renderer: renderer, //optional
        });
      });
  }
}
