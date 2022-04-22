import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { LocationService } from "src/app/services/location.service";
import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-location",
    templateUrl: "./location.component.html",
    styleUrls: ["./location.component.css"],
})
export class LocationComponent implements OnInit {
    @Input() project;
    @Output() setLocationHeader: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private router: Router,
        private locationService: LocationService,
        private projectService: ProjectService
    ) {}

    location;
    locations = [];

    ngOnInit(): void {
        this.locationService.getLocations().subscribe((locations) => {
            this.locations = locations;
            if (this.project.location) {
                for (let location of locations) {
                    if (location.id === this.project.location) {
                        this.location = location;
                        this.setLocationHeader.emit(location);
                    }
                }
            }
        });
    }

    selectLocation(location) {
        console.log("setLocation!");
        this.projectService.selectLocation(this.project, location).subscribe((project) => {
            this.project = project;
            this.location = location;
            this.setLocationHeader.emit(location);
        });
    }

    removeLocation(): void {
        this.location = null;
        this.setLocationHeader.emit(null);
    }

    createLocation() {
        // passing projectID so the map knows which project to go back to
        this.router.navigateByUrl(`create-location/${this.project.id}`);
    }

    deleteLocation(location) {
        this.locationService.deleteLocation(location.id).subscribe(() => {
            this.locationService.getLocations().subscribe((locations) => {
                this.locations = [...locations];
            });
        });
    }
}
