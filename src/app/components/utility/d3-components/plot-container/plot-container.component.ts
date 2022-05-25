import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-plot-container",
    templateUrl: "./plot-container.component.html",
    styleUrls: ["./plot-container.component.css"],
})
export class PlotContainerComponent implements OnInit {
    @Input() dataset;
    @Input() plotType;

    constructor() {}

    ngOnInit(): void {}
}
