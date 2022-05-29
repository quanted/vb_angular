import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-data-statistics",
    templateUrl: "./data-statistics.component.html",
    styleUrls: ["./data-statistics.component.css"],
})
export class DataStatisticsComponent implements OnInit {
    @Input() projectData;

    currentPlots = [
        { type: "bar", id: "plot_1" },
        { type: "line", id: "plot_2" },
        { type: "bar", id: "plot_3" },
        { type: "line", id: "plot_4" },
    ];

    constructor() {}

    ngOnInit(): void {}
}
