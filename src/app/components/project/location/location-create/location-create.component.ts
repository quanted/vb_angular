import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-location-create",
    templateUrl: "./location-create.component.html",
    styleUrls: ["./location-create.component.css"],
})
export class LocationCreateComponent implements OnInit {
    projectID;

    constructor(private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        if (this.route.paramMap) {
            this.projectID = this.route.snapshot.paramMap.get("id");
            console.log("create:projectID: ", this.projectID);
        }
    }

    closeCreate(): void {
        this.router.navigateByUrl(`project/${this.projectID}`);
    }

    gohome(): void {
        this.router.navigateByUrl("home");
    }
}
