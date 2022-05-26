import { AfterViewInit, Component, Input, OnInit } from "@angular/core";

import * as d3 from "d3";

@Component({
    selector: "app-bar-chart",
    templateUrl: "./bar-chart.component.html",
    styleUrls: ["./bar-chart.component.css"],
})
export class BarChartComponent implements OnInit, AfterViewInit {
    @Input() id;
    @Input() projectData;
    @Input() selectedGroup;

    private svg;
    private margin = 50;
    private width = 500 - this.margin / 2;
    private height = 300 - this.margin / 2;

    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        console.log("dataset: ", this.projectData);
        console.log("selectedGroup: ", this.selectedGroup);
        this.svg = d3
            .select(`figure#${this.id}`)
            .append("svg")
            .attr("width", this.width + this.margin * 2)
            .attr("height", this.height + this.margin * 2)
            .append("g")
            .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

        const x = d3
            .scaleBand()
            .range([0, this.width])
            .domain(this.projectData.columnData.map((d) => d.Time_Stamp))
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

        const dataFilter = this.projectData.columnData.map((d) => {
            return {
                time: d.Time_Stamp,
                value: d[this.selectedGroup],
            };
        });

        this.svg
            .selectAll("bars")
            .data(dataFilter)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.time))
            .attr("y", (d) => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", (d) => this.height - y(d.value))
            .attr("fill", d3.color("red"));
    }
}
