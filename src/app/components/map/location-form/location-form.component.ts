import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MapService } from "src/app/services/map.service";
import { LocationService } from "src/app/services/location.service";

@Component({
  selector: "app-location-form",
  templateUrl: "./location-form.component.html",
  styleUrls: ["./location-form.component.css"],
})
export class LocationFormComponent implements OnInit {
  locationForm: FormGroup;
  markers = [];

  constructor(
    private fb: FormBuilder,
    private mapService: MapService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      start_latitude: [null, Validators.required],
      start_longitude: [null, Validators.required],
      end_latitude: [null, Validators.required],
      end_longitude: [null, Validators.required],
      o_latitude: [null, Validators.required],
      o_longitude: [null, Validators.required],
    });
    this.mapService.markerChangeObserver.subscribe((markers) => {
      this.markers = markers;
      if (this.markers.length > 0) {
        this.updateLocationForm();
      }
    });
  }

  saveLocation() {
    if (this.locationForm.valid) {
      console.log(this.locationForm.value);
      this.locationService
        .addLocation(this.locationForm.value)
        .subscribe((response) => {
          console.log("add-location: ", response);
        });
    } else {
      console.log("form invalid!");
    }
  }

  clearForm() {
    this.locationForm.reset();
    this.mapService.clearMarkers();
  }

  updateLocationForm() {
    // markers[0] = start
    // markers[1] = end
    // markers[2] = water
    // markers[3] = land
    this.locationForm
      .get("start_latitude")
      .setValue(this.markers[0]._latlng.lat);
    this.locationForm
      .get("start_longitude")
      .setValue(this.markers[0]._latlng.lng);

    if (this.markers[1]) {
      this.locationForm
        .get("end_latitude")
        .setValue(this.markers[1]._latlng.lat);
      this.locationForm
        .get("end_longitude")
        .setValue(this.markers[1]._latlng.lng);
      this.locationForm.get("o_latitude").setValue(this.markers[2]._latlng.lat);
      this.locationForm
        .get("o_longitude")
        .setValue(this.markers[2]._latlng.lng);
    }
  }

  flyToStart() {
    this.mapService.flyTo(this.markers[0]._latlng);
  }

  flyToEnd() {
    this.mapService.flyTo(this.markers[1]._latlng);
  }
}
