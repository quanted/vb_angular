import { Component, OnInit } from "@angular/core";
import { LocationService } from "src/app/services/location.service";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  username = "";
  statusMessage = "";
  locations = [];

  constructor(
    private locationService: LocationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.locationService.getLocations().subscribe((locations) => {
      if (!locations.error) {
        if (locations.length < 1) {
          this.statusMessage = "You have no stored locations";
        } else {
          console.log(locations);
          this.locations = locations;
        }
      } else {
        console.log(locations.error);
      }
    });
  }

  addLocation(): void {
    console.log("add location");
    this.router.navigateByUrl("map");
  }
}
