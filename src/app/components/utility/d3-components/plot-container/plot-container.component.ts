import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-plot-container",
    templateUrl: "./plot-container.component.html",
    styleUrls: ["./plot-container.component.css"],
})
export class PlotContainerComponent implements OnInit {
    @Input() projectData;
    @Input() plotType;
    @Input() id;

    plotTypes = ["bar", "line", "scatter"];

    selectedGroup;

    constructor() {}

    ngOnInit(): void {
        this.selectedGroup = this.projectData.columnNames[1];
    }

    selectPlotType(type): void {
        this.plotType = type;
    }

    selectGroup(groupName): void {
        this.selectedGroup = groupName;
    }
}
