import { Component, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from "@angular/core";

import { AuthService } from "./services/auth/auth.service";
import { LoadingIndicatorService } from "./services/loading-indicator.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewChecked {
    title = "vbweb";

    showLoader = false;

    constructor(
        private auth: AuthService,
        private changeDetector: ChangeDetectorRef,
        public loadingIndicator: LoadingIndicatorService
    ) {}

    ngAfterViewChecked() {
        this.loadingIndicator.showLoader.subscribe((showLoader) => {
            this.showLoader = showLoader;
            this.changeDetector.detectChanges();
        });
    }

    userIsAuthenticated(): boolean {
        return this.auth.userIsAuthenticated();
    }
}
