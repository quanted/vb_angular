import { Component, Input, OnInit } from "@angular/core";

import * as d3 from "d3";

@Component({
    selector: "app-bar-chart",
    templateUrl: "./bar-chart.component.html",
    styleUrls: ["./bar-chart.component.css"],
})
export class BarChartComponent implements OnInit {
    @Input() dataset;

    private svg;
    private margin = 50;
    private width = 750 - this.margin / 2;
    private height = 400 - this.margin / 2;

    constructor() {}

    ngOnInit(): void {
        console.log("dataset: ", this.dataset);
        this.svg = d3
            .select("figure#bar")
            .append("svg")
            .attr("width", this.width + this.margin * 2)
            .attr("height", this.height + this.margin * 2)
            .append("g")
            .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

        const x = d3
            .scaleBand()
            .range([0, this.width])
            .domain(this.dataset.dataset.map((d) => d.Time_Stamp))
            .padding(0.2);

        this.svg
            .append("g")
            .attr("transform", "translate(0, " + this.height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10, 0)rotate(-45)")
            .style("text-anchor", "end");

        const y = d3.scaleLinear().domain([0, 30]).range([this.height, 0]);

        this.svg.append("g").call(d3.axisLeft(y));

        const colorScale = d3.scaleLinear<string>().domain([0, 40000]).range(["green", "blue"]);

        this.svg
            .selectAll("bars")
            .data(this.dataset.dataset)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.Time_Stamp))
            .attr("y", (d) => y(d.AIR_TEMP))
            .attr("width", x.bandwidth())
            .attr("height", (d) => this.height - y(d.AIR_TEMP))
            .attr("fill", (d) => colorScale(d.AIR_TEMP));
    }
}
