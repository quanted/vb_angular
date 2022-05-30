import { Component, Input, OnInit, ViewContainerRef } from "@angular/core";

// import { LineChartComponent } from "../line-chart/line-chart.component";
// import { BarChartComponent } from "../bar-chart/bar-chart.component";

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

    constructor(private viewContainerRef: ViewContainerRef) {}

    ngOnInit(): void {
        this.selectedGroup = this.projectData.columnNames[1];
        let plot;
        // if (this.plotType === "line") {
        //     plot = this.viewContainerRef.createComponent(LineChartComponent);
        // }
        // if (this.plotType === "bar") {
        //     plot = this.viewContainerRef.createComponent(BarChartComponent);
        // }
        // plot.instance.projectData = this.projectData;
        // plot.instance.id = this.id;
        // plot.instance.selectedGroup = this.selectedGroup;
    }

    selectPlotType(type): void {
        this.plotType = type;
    }

    selectGroup(groupName): void {
        this.selectedGroup = groupName;
    }
}
