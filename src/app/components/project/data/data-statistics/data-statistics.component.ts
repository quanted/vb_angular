import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-data-statistics",
    templateUrl: "./data-statistics.component.html",
    styleUrls: ["./data-statistics.component.css"],
})
export class DataStatisticsComponent implements OnInit {
    @Input() projectData;

    currentPlots = [
        { type: "bar", id: "bar_1" },
        { type: "line", id: "line_1" },
        { type: "bar", id: "bar_2" },
        { type: "line", id: "line_2" },
    ];

    constructor() {}

    ngOnInit(): void {}
}
