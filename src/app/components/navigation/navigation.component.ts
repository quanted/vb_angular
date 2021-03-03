import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent implements OnInit {
  username: string;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.username = this.auth.getUsername();
  }

  gotoHome(): void {
    this.router.navigateByUrl("home");
  }

  logout(): void {
    this.auth.logout();
  }
}
