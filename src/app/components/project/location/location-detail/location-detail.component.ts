import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "app-location-detail",
    templateUrl: "./location-detail.component.html",
    styleUrls: ["./location-detail.component.css"],
})
export class LocationDetailComponent implements OnInit {
    @Input() location;
    @Output() removeLocation: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}

    remove(): void {
        this.removeLocation.emit();
    }
}
