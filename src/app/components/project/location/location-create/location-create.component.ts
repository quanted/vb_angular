import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-location-create",
    templateUrl: "./location-create.component.html",
    styleUrls: ["./location-create.component.css"],
})
export class LocationCreateComponent implements OnInit {
    private projectID;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        if (this.route.paramMap) {
            this.projectID = this.route.snapshot.paramMap.get("id");
        }
    }

    closeCreate(): void {
        this.router.navigateByUrl(`project/${this.projectID}`);
    }
}
