import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  default = "rgba(255, 0, 255, 1)";
  beachline = "rgba(255, 0, 0, 1)";

  constructor() {}

  getColor(color): string {
    switch (color) {
      case "beachline":
        return this.beachline;
      default:
        return this.default;
    }
  }
}
