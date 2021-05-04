import {Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';
import {nest} from 'd3-collection';

@Component({
  selector: 'app-line-plot',
  templateUrl: './line-plot.component.html',
  styleUrls: ['./line-plot.component.css']
})
export class LinePlotComponent implements OnInit {
  data = [{
    type: 'elastic-net',
    x: 0,
    y: -65.27895885073885
  }, {
    type: 'elastic-net',
    x: 1,
    y: -66.82495259327669
  }, {
    type: 'elastic-net',
    x: 2,
    y: -66.41915594765015
  }, {
    type: 'elastic-net',
    x: 3,
    y: -65.51882623118011
  }, {
    type: 'elastic-net',
    x: 4,
    y: -65.8962766953631
  }, {
    type: 'elastic-net',
    x: 5,
    y: -66.7833964168636
  }, {
    type: 'elastic-net',
    x: 6,
    y: -66.78713752340987
  }, {
    type: 'elastic-net',
    x: 7,
    y: -66.31099797783345
  }, {
    type: 'elastic-net',
    x: 8,
    y: -66.18622363525242
  }, {
    type: 'elastic-net',
    x: 9,
    y: -64.67974766405702
  }, {
    type: 'rbf-svr-cv',
    x: 0,
    y: -60.0983606038508
  }, {
    type: 'rbf-svr-cv',
    x: 1,
    y: -61.365294712839535
  }, {
    type: 'rbf-svr-cv',
    x: 2,
    y: -62.345185837602884
  }, {
    type: 'rbf-svr-cv',
    x: 3,
    y: -60.52895886891506
  }, {
    type: 'rbf-svr-cv',
    x: 4,
    y: -60.443169041594615
  }, {
    type: 'rbf-svr-cv',
    x: 5,
    y: -61.50693325315493
  }, {
    type: 'rbf-svr-cv',
    x: 6,
    y: -61.1507280718716
  }, {
    type: 'rbf-svr-cv',
    x: 7,
    y: -61.56594029483913
  }, {
    type: 'rbf-svr-cv',
    x: 8,
    y: -60.438969127716824
  }, {
    type: 'rbf-svr-cv',
    x: 9,
    y: -60.419245571141346
  }, {
    type: 'lassolars',
    x: 0,
    y: -65.14373735844013
  }, {
    type: 'lassolars',
    x: 1,
    y: -66.7302480284606
  }, {
    type: 'lassolars',
    x: 2,
    y: -66.26099452440022
  }, {
    type: 'lassolars',
    x: 3,
    y: -65.45060112633323
  }, {
    type: 'lassolars',
    x: 4,
    y: -65.87265929567731
  }, {
    type: 'lassolars',
    x: 5,
    y: -66.16968914097092
  }, {
    type: 'lassolars',
    x: 6,
    y: -65.85205393656906
  }, {
    type: 'lassolars',
    x: 7,
    y: -66.00075761439604
  }, {
    type: 'lassolars',
    x: 8,
    y: -66.53419669336557
  }, {
    type: 'lassolars',
    x: 9,
    y: -64.48864001037778
  }, {
    type: 'multi_pipe',
    x: 0,
    y: -61.30588892212498
  }, {
    type: 'multi_pipe',
    x: 1,
    y: -62.663345398960104
  }, {
    type: 'multi_pipe',
    x: 2,
    y: -63.20860230441206
  }, {
    type: 'multi_pipe',
    x: 3,
    y: -61.339304466412266
  }, {
    type: 'multi_pipe',
    x: 4,
    y: -61.582673984893376
  }, {
    type: 'multi_pipe',
    x: 5,
    y: -62.96533681352146
  }, {
    type: 'multi_pipe',
    x: 6,
    y: -62.20560607439683
  }, {
    type: 'multi_pipe',
    x: 7,
    y: -62.620630318912845
  }, {
    type: 'multi_pipe',
    x: 8,
    y: -61.638712665843535
  }, {
    type: 'multi_pipe',
    x: 9,
    y: -61.355637064699046
  }];
  svg: any;
  margin = { top: 30, right: 30, bottom: 30, left: 30 };
  padding: { top: number; right: number; bottom: number; left: number; };
  dataKeys: string[];
  width;
  height;
  scaleX;
  scaleY;


  ngOnInit(): void {
    this.initChart();
    this.createChart();
  }

  private initChart(): void {
    this.svg = d3.select('svg');

    this.width = this.svg.style('width').replace('px', '');
    this.height = this.svg.style('height').replace('px', '');

    this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.scaleX = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.x))
      .range([this.margin.left, this.width - this.margin.right]);

    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + 0 + ',' + (this.height - this.margin.bottom) + ')')
      .call(d3.axisBottom(this.scaleX)); // Create an axis component with d3.axisBottom

    this.scaleY = d3.scaleLinear()
      .domain(d3.extent(this.data, d =>  d.y))
      .range([this.height - this.margin.bottom, this.margin.top/2]);

    this.svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + this.margin.left + ', 0)')
      .call(d3.axisLeft(this.scaleY));
  }

  private createChart(): void {
    const sumstat = nest()
      .key(d => d.type)
      .entries(this.data);

    console.log(sumstat)
    const lineNames = sumstat.map(d => d.key);
    const color = d3.scaleOrdinal().domain(lineNames).range(['#84df7c', '#373258',
      '#cc5f5f' , '#89cbfd', '#f9ed7a']);
    /*
    d3.select('svg')
      .selectAll(".line")
      .append("g")
      .attr("class", "line")
      .data(sumstat)
      .enter()
      .append("path")
      .attr("d", function (d) {
        return d3.line()
          .x(d => this.scaleX(d.year))
          .y(d => this.scaleY(d.spending)).curve(d3.curveCardinal)
          (d.values)
      })
      .attr("fill", "none")
      .attr("stroke", d => color(d.key))
      .attr("stroke-width", 2)
     */

    d3.select('svg')
      .selectAll('.line')
      .style('background', 'none')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('display', 'block')
      .data(sumstat)
      .enter()
      .append('path')
      .attr('d',  d => {
        return d3.line()
          .x(D => {
            console.log(D)
            return this.scaleX(D['x']);
          })
          .y(D => this.scaleY(D['y']))
          (d['values']);
      })
      .attr('fill', 'none')
      .attr('stroke', d => {
        return color(d['key']) as string;
      })
      .attr('stroke-width', 1.5);
  }
}
