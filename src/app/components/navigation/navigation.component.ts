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
    this.router.navigateByUrl("/map");
  }

  gotoMap(): void {
    this.router.navigateByUrl("/map");
  }

  gotoData(): void {
    this.router.navigateByUrl("/data");
  }

  gotoResults(): void {
    this.router.navigateByUrl("/results");
  }
}
