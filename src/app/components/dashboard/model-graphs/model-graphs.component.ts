import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
// @ts-ignore
import * as data from '../../../../../test_data/projec_cv_results.json';

@Component({
  selector: 'app-model-graphs',
  templateUrl: './model-graphs.component.html',
  styleUrls: ['./model-graphs.component.css']
})
export class ModelGraphsComponent implements OnInit {
  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    this.drawPlot();
  }

  private createSvg(): void {
    this.svg = d3.select('figure#scatter')
      .append('svg')
      .attr('width', this.width + (this.margin * 2))
      .attr('height', this.height + (this.margin * 2))
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawPlot(): void {
    // Add title
    this.svg.append('text')
      .attr('x', (this.width / 2))
      .attr('y', 0 - (this.margin / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('elastic-net neg_mean_absolute_error');

    // Add X axis
    const x = d3.scaleLinear()
      .domain([1, data.cv_score['elastic-net'].neg_mean_absolute_error.length])
      .range([ 0, this.width ]);
    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([Math.min(...data.cv_score['elastic-net'].neg_mean_absolute_error),
        Math.max(...data.cv_score['elastic-net'].neg_mean_absolute_error) + 1])
      .range([this.height, 0]);
    this.svg.append('g')
      .call(d3.axisLeft(y));

    // Add dots
    const dots = this.svg.append('g');
    let index = 0;
    dots.selectAll('dot')
      .data(data.cv_score['elastic-net'].neg_mean_absolute_error)
      .enter()
      .append('circle')
      .attr('cx', d => x(index += 1))
      .attr('cy', d => y(d))
      .attr('r', 5)
      .style('opacity', 1)
      .style('fill', '#69b3a2');

    // Add labels
    dots.selectAll('text')
      .data(data.cv_score['elastic-net'].neg_mean_absolute_error)
      .enter();
  }
}
