import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isAuthenticated = false;

  constructor(private router: Router) {}

  userIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  login(): void {
    this.isAuthenticated = true;
    this.goHome();
  }

  logout(): void {
    this.isAuthenticated = false;
    this.goHome();
  }

  goHome(): void {
    this.router.navigateByUrl("/");
  }
}
