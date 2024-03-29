import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import * as d3 from "d3";
// import {nest} from 'd3-collection';

@Component({
  selector: "app-box-plot",
  templateUrl: "./box-plot.component.html",
  styleUrls: ["./box-plot.component.css"],
})
export class BoxPlotComponent implements OnInit, OnChanges {
  // @ViewChild used to get this components child chart on a per component basis.
  // The static attribute is set to True to resolve query results before change
  // detection runs. Without this, changes are applied to data before chart is
  // retrieved and set to a variable.
  @ViewChild("chart", { static: true }) public chart: ElementRef;

  // @Input data must be of the specified format to properly render multi data
  // group charts.
  @Input() data: { type: string; x: any; y: number }[];

  svg: any;
  width: number;
  height: number;
  margin = { top: 30, right: 30, bottom: 30, left: 30 };
  scaleX: any;
  scaleY: any;

  public constructor(public chartElem: ElementRef) {}

  ngOnInit(): void {
    this.initChart();
    this.createChart();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty("data") && this.data) {
      this.initChart();
      this.createChart();
      window.addEventListener("resize", () => {
        // remove appended 'g's
        this.svg.selectAll("g").remove();
        // remove append 'paths'
        this.svg.selectAll("path").remove();
        // Re-init and draw
        this.initChart();
        this.createChart();
      });
    }
  }

  private initChart(): void {
    this.svg = d3.select(this.chart.nativeElement);

    this.width = this.svg.style("width").replace("px", "");
    this.height = this.svg.style("height").replace("px", "");

    this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    this.scaleX = d3
      .scaleLinear()
      .domain(d3.extent(this.data, (d) => d.x))
      .range([this.margin.left, this.width - this.margin.right]);

    this.svg
      .append("g")
      .attr("class", "x axis")
      .attr(
        "transform",
        "translate(" + 0 + "," + (this.height - this.margin.bottom) + ")"
      )
      .call(d3.axisBottom(this.scaleX)); // Create an axis component with d3.axisBottom

    this.scaleY = d3
      .scaleLinear()
      .domain(d3.extent(this.data, (d) => d.y))
      .range([this.height - this.margin.bottom, this.margin.top / 2]);

    this.svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + this.margin.left + ", 0)")
      .call(d3.axisLeft(this.scaleY).ticks(5));
  }

  private createChart(): void {
    const sumstat = [];

    // const sumstat = nest()
    //   .key(d => d.type)
    //   .entries(this.data);

    const lineNames = sumstat.map((d) => d.key);
    const color = d3
      .scaleOrdinal()
      .domain(lineNames)
      .range(["#84df7c", "#373258", "#cc5f5f", "#89cbfd", "#f9ed7a"]);

    this.svg
      .selectAll(".line")
      .style("background", "none")
      .attr("width", this.width)
      .attr("height", this.height)
      .style("display", "block")
      .data(sumstat)
      .enter()
      .append("path")
      .attr("d", (d) => {
        return d3
          .line()
          .x((D) => {
            console.log(D);
            return this.scaleX(D["x"]);
          })
          .y((D) => this.scaleY(D["y"]))(d["values"]);
      })
      .attr("fill", "none")
      .attr("stroke", (d) => {
        return color(d["key"]) as string;
      })
      .attr("stroke-width", 1.5);
  }
}
