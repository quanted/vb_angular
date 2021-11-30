import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { nest } from 'd3-collection';

@Component({
  selector: 'app-line-plot',
  templateUrl: './line-plot.component.html',
  styleUrls: ['./line-plot.component.css']
})
export class LinePlotComponent implements OnInit, OnChanges {

  // @ViewChild used to get this components child chart on a per component basis.
  // The static attribute is set to True to resolve query results before change
  // detection runs. Without this, changes are applied to data before chart is
  // retrieved and set to a variable.
  @ViewChild('chart', { static: true }) public chart: ElementRef;

  // @Input data must be of the specified format to properly render multi data
  // group charts.
  @Input() data: { type: string, x: any, y: number }[];

  svg: any;
  width: number;
  height: number;
  margin = { top: 30, right: 30, bottom: 30, left: 50 };
  scaleX: any;
  scaleY: any;

  public constructor(public chartElem: ElementRef) { }

  ngOnInit(): void {
    this.initChart();
    this.createChart();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('data') && this.data) {
      if (this.svg !== undefined && !changes.data.firstChange) {
        // remove appended 'g's
        this.svg.selectAll('g').remove();
        // remove append 'paths'
        this.svg.selectAll('path').remove();
        this.initChart();
        this.createChart();
      }
      window.addEventListener('resize', () => {
        // remove appended 'g's
        this.svg.selectAll('g').remove();
        // remove append 'paths'
        this.svg.selectAll('path').remove();
        // Remove legend
        this.svg.selectAll('rect').remove();
        this.svg.selectAll('circle').remove();
        // Re-init and draw
        this.initChart();
        this.createChart();
      });
    }
  }

  /**
   * Initializes the chart: width, height, and axis scales.
   * @private
   */
  private initChart(): void {
    this.svg = d3.select(this.chart.nativeElement);

    this.width = this.svg.style('width').replace('px', '');
    this.height = this.svg.style('height').replace('px', '');

    this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // TODO: Add typeof check for string data and use scaleOrdinal or scalePoint instead.
    this.scaleX = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.x))
      .range([this.margin.left, this.width - this.margin.right]);

    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + 0 + ',' + (this.height - this.margin.bottom) + ')')
      .call(d3.axisBottom(this.scaleX)); // Create an axis component with d3.axisBottom

    this.scaleY = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.y))
      .range([this.height - this.margin.bottom, this.margin.top / 2]);

    this.svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + this.margin.left + ', 0)')
      .call(d3.axisLeft(this.scaleY).ticks(5));
  }

  /**
   * Draws the chart on the webpage.
   * @private
   */
  private createChart(): void {

    // Parse the data data into keys based on type for d3 charting
    const sumstat = nest()
      .key(d => d.type)
      .entries(this.data);

    // Get each key and place in a list
    const lineNames = sumstat.map(d => d.key);

    // Create a function color() that returns a mapped hex color from a key name.
    const color = d3.scaleOrdinal().domain(lineNames).range([
      '#003f5c',
      '#58508d',
      '#bc5090',
      '#ff6361',
      '#ffa600'
    ]);

    // Draw the chart
    this.svg.selectAll('.line')
      .style('background', 'none')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('display', 'block')
      .data(sumstat)
      .enter()
      .append('path')
      .attr('d', d => {
        return d3.line()
          .x(D => {
            return this.scaleX(D[`x`]);
          })
          .y(D => this.scaleY(D[`y`]))
          .curve(d3.curveBasis)
          (d.values);
      })
      .attr('fill', 'none')
      .attr('stroke', d => {
        return color(d.key) as string;
      })
      .attr('stroke-width', 2);

    // Draw legend box
    this.svg.append('rect')
      .attr('x', this.margin.left * 2)
      .attr('y', 0)
      .attr('width', 100)
      .attr('height', 60)
      .attr('stroke', 'black')
      .attr('fill', 'white');

    // Draw legend circles
    this.svg.selectAll('dots')
      .data(lineNames)
      .enter()
      .append('circle')
      .attr('cx', this.margin.left * 2 + 5)
      .attr('cy', (d, i) => 7 + i * (60 / lineNames.length))
      .attr('r', 2)
      .style('fill', (d) => color(d));

    // Draw legend text
    this.svg.selectAll('labels')
      .data(lineNames)
      .enter()
      .append('text')
      .attr('x', this.margin.left * 2 + 10)
      .attr('y', (d, i) => 7 + i * (60 / lineNames.length))
      .style('fill', (d) => color(d))
      .text((d) => d)
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
      .style('font-size', '11px');
  }
}
