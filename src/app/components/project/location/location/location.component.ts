import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";

import { LocationService } from "src/app/services/location.service";
import { ProjectService } from "src/app/services/project.service";

import { MatDialog } from "@angular/material/dialog";
import { DeleteConfirmationDialogComponent } from "src/app/components/utility/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component";

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
        private projectService: ProjectService,
        private deleteDialog: MatDialog
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
        this.projectService.selectLocation(this.project, location).subscribe((project) => {
            this.location = location;
            this.setLocationHeader.emit(location);
        });
    }

    removeLocation(): void {
        this.location = null;
        this.selectLocation(null);
    }

    createLocation() {
        // passing projectID so the map knows which project to go back to
        this.router.navigateByUrl(`create-location/${this.project.id}`);
    }

    deleteLocation(location) {
        const dialogRef = this.deleteDialog.open(DeleteConfirmationDialogComponent, {
            data: { type: `Location ${location.name}` },
        });

        dialogRef.afterClosed().subscribe((confirmDelete) => {
            if (confirmDelete) {
                this.locationService.deleteLocation(location.id).subscribe(() => {
                    this.locationService.getLocations().subscribe((locations) => {
                        this.locations = [...locations];
                    });
                });
            }
        });
    }
}
