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
    @Input() set selectedGroup(groupName: string) {
        this.group = groupName;
        this.updatePlot();
    }

    private MARGIN = 50;
    private WIDTH = 500 - this.MARGIN / 2;
    private HEIGHT = 300 - this.MARGIN / 2;

    private svg;
    private plot;
    private group;

    private xScale = d3.scaleBand();
    private yScale = d3.scaleLinear();

    private xAxis;
    private yAxis;

    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.svg = d3
            .select(`figure#${this.id}`)
            .append("svg")
            .attr("width", this.WIDTH + this.MARGIN * 2)
            .attr("height", this.HEIGHT + this.MARGIN * 2)
            .append("g")
            .attr("transform", "translate(" + this.MARGIN + "," + this.MARGIN + ")");

        this.xScale
            .range([0, this.WIDTH])
            .domain(this.projectData.columnData.map((d) => d.Time_Stamp))
            .padding(0.2);

        this.xAxis = this.svg.append("g").attr("transform", "translate(0, " + this.HEIGHT + ")");

        this.xAxis
            .call(d3.axisBottom(this.xScale))
            .selectAll("text")
            .attr("transform", "translate(-10, 0)rotate(-45)")
            .style("text-anchor", "end");

        this.yScale.domain([0, 30]).range([this.HEIGHT, 0]);

        this.yAxis = this.svg.append("g");

        this.yAxis.call(d3.axisLeft(this.yScale));

        this.plot = this.svg.append("path");
        this.updatePlot();
    }

    updatePlot(): void {
        if (!this.svg) return;

        const filteredData = this.projectData.columnData.map((d) => {
            return {
                time: d.Time_Stamp,
                value: d[this.group],
            };
        });

        this.plot
            .datum(filteredData)
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
                    .x((d) => this.xScale(d["time"]))
                    .y((d) => this.yScale(d["value"]))
            );
    }
}
