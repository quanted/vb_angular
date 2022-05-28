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

    selectedGroup;

    constructor() {}

    ngOnInit(): void {
        this.selectedGroup = this.projectData.columnNames[1];
    }

    selectGroup(groupName): void {
        this.selectedGroup = groupName;
    }
}