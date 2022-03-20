import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as Plotly from 'plotly.js/dist/plotly.js';

@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.css']
})
export class PlotlyComponent implements OnChanges {
  // Get access to the plot element in the DOM
  @ViewChild("plot", { static: true }) public plot: ElementRef;

  // Titles
  @Input() plotTitle: string;
  @Input() xAxisTitle: string;
  @Input() yAxisTitle: string;
  // Set to 0 for auto scaling # of tiks on xaxis or set to a number for custom tik count
  @Input() xNTicks: number;
  @Input() xAxisType: string;

  // Array of data with x values, y values, type (line, bar, etc...),
  // and name for each line to be plotted 
  @Input() data: {
    x: any,
    y: any,
    type: string,
    name: string,
  }[];

  // Any to hold the plot specific properties
  chart: any;

  ngOnInit() {
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && this.data) {
      this.chart.layout.title.text = this.plotTitle;
      this.chart.layout.xaxis.title.text = this.xAxisTitle;
      this.chart.layout.yaxis.title.text = this.yAxisTitle;
      this.chart.layout.xaxis.nticks = this.xNTicks ?? 0;
      this.chart.layout.xaxis.type = this.xAxisType ?? "linear";
      this.chart.data = this.data;
      Plotly.react(this.plot.nativeElement, this.chart);
    }
  }

  setChart() {
    let color = "FFFFFF";
    // Set plot specific properties
    this.chart = {
      data: this.data,
      layout: {
        paper_bgcolor: "#282828",
        plot_bgcolor: "#282828",
        title: {
          text: this.plotTitle,
          font: { size: 14, color: color }
        },
        xaxis: {
          title: {
            text: this.xAxisTitle,
          },
          tickfont: {
            size: 9
          },
          color: color
        },
        yaxis: {
          title: { text: this.yAxisTitle },
          tickfont: {
            size: 9
          },
          color: color
        },
        margin: {
          l: 40,
          r: 30,
          b: 35,
          t: 40,
        },
        autosize: true,
        showlegend: true,
        legend: {
          font: { color: color },
          itemsizing: "constant",
        }
      },
      config: {
        responsive: true,
        displaylogo: false,
        useResizeHandler: true,
        style: { width: "100%", height: "100%" },
      },
    };
  }

  draw(): void {
    this.setChart();
    // Plot 
    Plotly.newPlot(this.plot.nativeElement, this.chart).then(() => {
      // Sometimes plot drawn before views completely rendered. Fire
      // resize event to fix this.
      window.requestAnimationFrame(function () {
        window.dispatchEvent(new Event('resize'));
      });
    });
  }
}

