import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  userIsAuthenticated(): boolean {
    return this.auth.userIsAuthenticated();
  }

  logout(): void {
    this.auth.logout();
  }

  gotoHome(): void {
    this.router.navigateByUrl("/");
  }

  gotoMap(): void {
    this.router.navigateByUrl("/map");
  }

  gotoMap2(): void {
    this.router.navigateByUrl("/map-esri");
  }

  gotoMap3(): void {
    this.router.navigateByUrl("/map-leaflet");
  }

  gotoData(): void {
    this.router.navigateByUrl("/data");
  }

  gotoAnalytical(): void {
    this.router.navigateByUrl("/analytical");
  }

  gotoPrediction(): void {
    this.router.navigateByUrl("/prediction");
  }
}
