import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LocationData } from 'src/app/models/location-data';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  constructor(
    private router: Router, 
    private locationService: LocationService
    ) { }

  @Input() projectID;
  @Input() location: LocationData;
  @Output() locationName: EventEmitter<any> = new EventEmitter<any>();
  locations;

  ngOnInit(): void {
    console.log(this.location);
    this.locationService.getLocations().subscribe((locations) => {
      this.locations = [...locations];
      console.log(locations);
    });
  }

  selectLocation(location) {
    console.log(location);
    this.location = location;
    this.locationName.emit(location.name);
  }

  createLocation() {
    this.router.navigateByUrl(`map/${this.projectID}`);
  }

  deleteLocation(location) {
    this.locationService.deleteLocation(location.id).subscribe(() => {
      this.locationService.getLocations().subscribe((locations) => {
        this.locations = [...locations];
      })
    });
  }
}
