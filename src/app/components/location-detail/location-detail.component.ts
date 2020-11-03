import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})
export class LocationDetailComponent implements OnInit {

  constructor(
    private locationService: LocationService,
    private router: Router,
  ) { }

  @Input() location: any;

  ngOnInit(): void {
  }

  deleteLocation(): void {
    this.locationService.deleteLocation(this.location.id).subscribe();
  }

  gotoLocation() {
    this.router.navigateByUrl(`location/${this.location.id}`);
  }

}
