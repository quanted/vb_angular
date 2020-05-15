import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isAuthenticated = false;

  constructor() {}

  userIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  login(): boolean {
    this.isAuthenticated = true;
    return true;
  }

  logout(): boolean {
    this.isAuthenticated = false;
    return true;
  }
}
