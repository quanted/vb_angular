import { AfterViewInit, Component, Input, OnInit } from "@angular/core";

import * as d3 from "d3";

@Component({
    selector: "app-line-chart",
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.css"],
})
export class LineChartComponent implements OnInit, AfterViewInit {
    @Input() id;
    @Input() projectData;
    @Input() selectedGroup = "AIR_TEMP";

    private svg;
    private margin = 50;
    private width = 500 - this.margin / 2;
    private height = 300 - this.margin / 2;

    xAxis = d3.scaleBand();
    yAxis = d3.scaleLinear();

    currentPlot;

    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        const selector = `figure#${this.id}`;
        console.log("figure#", selector);
        this.svg = d3
            .select(selector)
            .append("svg")
            .attr("width", this.width + this.margin * 2)
            .attr("height", this.height + this.margin * 2)
            .append("g")
            .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

        this.xAxis
            .range([0, this.width])
            .domain(this.projectData.columnData.map((d) => d.Time_Stamp))
            .padding(0.2);

        this.svg
            .append("g")
            .attr("transform", "translate(0, " + this.height + ")")
            .call(d3.axisBottom(this.xAxis))
            .selectAll("text")
            .attr("transform", "translate(-10, 0)rotate(-45)")
            .style("text-anchor", "end");

        this.yAxis.domain([0, 30]).range([this.height, 0]);

        this.svg.append("g").call(d3.axisLeft(this.yAxis));

        this.currentPlot = this.svg.append("path");

        this.updatePlot();
    }

    updatePlot(): void {
        const dataFilter = this.projectData.columnData.map((d) => {
            return {
                time: d.Time_Stamp,
                value: d[this.selectedGroup],
            };
        });

        this.currentPlot
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("stroke-opacity", 1)
            .attr(
                "d",
                d3
                    .line()
                    .x((d) => this.xAxis(d["time"]))
                    .y((d) => this.yAxis(d["value"]))
            );
    }
}
