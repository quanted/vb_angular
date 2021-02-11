import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {LocationService} from '../../services/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  panelOpenState = false;
  location_ID;
  location = {};
  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.location_ID = this.route.snapshot.paramMap.get('id');
    this.locationService.getLocations().subscribe((locations) => {
      this.location = locations.find((location) => {
        return location.id == this.location_ID;
      });
    });
  }
}
