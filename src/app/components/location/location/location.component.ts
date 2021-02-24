import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() location;
  @Output() locationName: EventEmitter<any> = new EventEmitter<any>();
  locations = [];

  ngOnInit(): void {
    this.locationService.getLocations().subscribe((locations) => {
      this.locations = [...locations];
    });
  }

  selectLocation(location) {
    this.location = location;
    this.locationName.emit(location.name);
  }

  createLocation() {
    // passing projectID so the map knows which project to go back to
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
