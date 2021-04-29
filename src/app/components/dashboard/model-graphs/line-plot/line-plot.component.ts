import {Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-plot',
  templateUrl: './line-plot.component.html',
  styleUrls: ['./line-plot.component.css']
})
export class LinePlotComponent implements OnInit {

  @Input() data: any;
  svg: any;
  margin = { top: 30, right: 30, bottom: 30, left: 30 };
  padding: { top: number; right: number; bottom: number; left: number; };
  dataKeys: string[];
  chartData = [];
  width;
  height;
  scaleX;
  scaleY;

  ngOnInit(): void {
    this.initChart();
    this.createChart();
  }

  private initChart(): void {
    // const element = this.chartContainer.nativeElement;

    this.svg = d3.select('svg');

    // this.margin = {
    //   top: this.svg.style('margin-top').replace('px', ''),
    //   right: this.svg.style('margin-right').replace('px', ''),
    //   bottom: this.svg.style('margin-bottom').replace('px', ''),
    //   left: this.svg.style('margin-left').replace('px', '')
    // };

    this.padding = {
      top: this.svg.style('padding-top').replace('px', ''),
      right: this.svg.style('padding-right').replace('px', ''),
      bottom: this.svg.style('padding-bottom').replace('px', ''),
      left: this.svg.style('padding-left').replace('px', '')
    };

    this.width = this.svg.style('width').replace('px', '');
    this.height = this.svg.style('height').replace('px', '');

    this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    for (let i = 0; i < this.data.y.length; i++) {
      this.chartData.push({ x: this.data.x[i], y: this.data.y[i]});
    }

    console.log('chartData: ', this.chartData);
    this.scaleX = d3.scalePoint()
      .domain(this.data.x)
      .range([this.margin.left, this.width - this.margin.right]);

    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + 0 + ',' + (this.height - this.margin.bottom) + ')')
      .call(d3.axisBottom(this.scaleX)); // Create an axis component with d3.axisBottom

    this.scaleY = d3.scaleLinear()
      .domain(d3.extent(this.chartData, d =>  d.y))
      .range([this.height - this.margin.bottom, this.margin.top]);

    this.svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + this.margin.left + ', 0)')
      .call(d3.axisLeft(this.scaleY));
  }

  private createChart(): void {
    d3.select('svg')
      .style('background', 'none')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('display', 'block')
      .append('path')
      .datum(this.chartData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
        .x((d) => {
          // console.log(this.scaleX(d['date']));
          return this.scaleX(d['x']);
        })
        .y((d) => this.scaleY(d['y']))
      );
  }
}
