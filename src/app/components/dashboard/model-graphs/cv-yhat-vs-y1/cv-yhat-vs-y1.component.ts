import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as Plotly from 'plotly.js/dist/plotly.js';

@Component({
  selector: 'app-cv-yhat-vs-y1',
  templateUrl: './cv-yhat-vs-y1.component.html',
  styleUrls: ['./cv-yhat-vs-y1.component.css']
})
export class CvYhatVsY1Component implements OnChanges {
  // Get access to the plot element in the DOM
  @ViewChild("plot", { static: true }) public plot: ElementRef;

  // Titles
  plotTitle = "Y and CV-test-Yhat";
  xAxisTitle = "Observed Y";
  yAxisTitle = "Predicted Y";
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
        paper_bgcolor: "#404040",
        plot_bgcolor: "#404040",
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

