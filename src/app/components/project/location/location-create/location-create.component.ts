import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-location-create",
    templateUrl: "./location-create.component.html",
    styleUrls: ["./location-create.component.css"],
})
export class LocationCreateComponent implements OnInit {
    project;

    constructor(private route: ActivatedRoute, private router: Router, private projectService: ProjectService) {}

    ngOnInit(): void {
        if (this.route.paramMap) {
            const id = this.route.snapshot.paramMap.get("id");
            this.projectService.getProject(id).subscribe((project) => {
                console.log(`getProject ${id}: `, project);
                this.project = project;
            });
        }
    }

    closeCreate(): void {
        this.router.navigateByUrl(`project/${this.project.id}`);
    }
}
