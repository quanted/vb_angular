import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-plot-container",
    templateUrl: "./plot-container.component.html",
    styleUrls: ["./plot-container.component.css"],
})
export class PlotContainerComponent implements OnInit {
    @Input() projectData;
    @Input() plotType;

    selectedGroup = "AIR_TEMP";

    constructor() {}

    ngOnInit(): void {
        this.selectedGroup = this.projectData.columnNames[0];
    }

    selectGroup(groupName): void {
        console.log("groupName: ", groupName);
        this.selectedGroup = groupName;
    }
}
