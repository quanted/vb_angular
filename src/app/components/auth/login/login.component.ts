import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  registerUser = false;
  resetUserPW = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {}

  login(): void {
    this.auth.login();
  }

  register(): void {
    this.registerUser = true;
  }

  isRegistering($event): void {
    this.registerUser = $event;
  }

  resetPW(): void {
    this.resetUserPW = true;
  }

  isResetting($event): void {
    this.resetUserPW = $event;
  }
}
