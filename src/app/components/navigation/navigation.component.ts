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

  logout(): void {
    this.auth.logout();
  }

  gotoHome(): void {
    this.router.navigateByUrl("/");
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
