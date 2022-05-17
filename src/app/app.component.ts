import { Component } from "@angular/core";

import { AuthService } from "./services/auth/auth.service";
import { LoadingIndicatorService } from "./services/loading-indicator.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    title = "vbweb";

    constructor(private auth: AuthService, public loadingIndicator: LoadingIndicatorService) {}

    userIsAuthenticated(): boolean {
        return this.auth.userIsAuthenticated();
    }
}
