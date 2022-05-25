import { Component, Input, OnInit } from "@angular/core";

import * as d3 from "d3";

@Component({
    selector: "app-basic-barchart",
    templateUrl: "./basic-barchart.component.html",
    styleUrls: ["./basic-barchart.component.css"],
})
export class BasicBarchartComponent implements OnInit {
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

        const testData = [
            { name: "ONE", two: "10", three: "100", four: "1000" },
            { name: "TWO", two: "15", three: "500", four: "15000" },
            { name: "THREE", two: "20", three: "1000", four: "20000" },
            { name: "FOUR", two: "25", three: "1500", four: "25000" },
            { name: "FIVE", two: "30", three: "2000", four: "30000" },
            { name: "SIX", two: "35", three: "2500", four: "35000" },
        ];

        const x = d3
            .scaleBand()
            .range([0, this.width])
            .domain(testData.map((d) => d.name))
            .padding(0.2);

        this.svg
            .append("g")
            .attr("transform", "translate(0, " + this.height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10, 0)rotate(-45)")
            .style("text-anchor", "end");

        const y = d3.scaleLinear().domain([0, 40000]).range([this.height, 0]);

        this.svg.append("g").call(d3.axisLeft(y));

        const colorScale = d3.scaleLinear<string>().domain([0, 40000]).range(["green", "blue"]);

        this.svg
            .selectAll("bars")
            .data(testData)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.name))
            .attr("y", (d) => y(d.four))
            .attr("width", x.bandwidth())
            .attr("height", (d) => this.height - y(d.four))
            .attr("fill", (d) => colorScale(d.four));
    }
}
