import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "app-data-detail",
    templateUrl: "./data-detail.component.html",
    styleUrls: ["./data-detail.component.css"],
})
export class DataDetailComponent implements OnInit {
    @Input() dataset;
    @Output() remove: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}

    removeDataset(): void {
        this.remove.emit();
    }
}
