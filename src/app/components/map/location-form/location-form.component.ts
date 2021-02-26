import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'src/app/services/map.service';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css'],
})
export class LocationFormComponent implements OnInit {
  locationForm: FormGroup;
  markers = [];

  @Input() projectID;

  constructor(
    private fb: FormBuilder,
    private mapService: MapService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      name: [null, Validators.required],
      type: ['beach', Validators.required],
      description: [null, Validators.required],
      start_latitude: [null, Validators.required],
      start_longitude: [null, Validators.required],
      end_latitude: [null, Validators.required],
      end_longitude: [null, Validators.required],
      o_latitude: [null, Validators.required],
      o_longitude: [null, Validators.required],
    });
    this.mapService.clearMarkers();
    this.mapService.markerChangeObserver.subscribe((markers) => {
      this.markers = markers;
      if (this.markers.length > 0) {
        this.updateLocationForm();
      }
    });
  }

  saveLocation() {
    if (this.locationForm.valid) {
      const data = this.locationForm.value;
      const location = {
        name: data.name,
        description: data.description,
        type: data.type,
        metadata: JSON.stringify({
          lat1: data.start_latitude,
          lng1: data.start_longitude,
          lat2: data.end_latitude,
          lng2: data.end_longitude,
          lat3: data.o_latitude,
          lng3: data.o_longitude
        })
      }
      this.locationService
        .addLocation(location)
        .subscribe(() => {
          this.router.navigateByUrl(`project/${this.projectID}`);
        });
    } else {
      console.log('form invalid!');
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
      .get('start_latitude')
      .setValue(this.markers[0]._latlng.lat);
    this.locationForm
      .get('start_longitude')
      .setValue(this.markers[0]._latlng.lng);

    if (this.markers[1]) {
      this.locationForm
        .get('end_latitude')
        .setValue(this.markers[1]._latlng.lat);
      this.locationForm
        .get('end_longitude')
        .setValue(this.markers[1]._latlng.lng);
      this.locationForm.get('o_latitude').setValue(this.markers[2]._latlng.lat);
      this.locationForm
        .get('o_longitude')
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
