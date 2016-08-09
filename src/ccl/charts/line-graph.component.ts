import { Component, ViewEncapsulation, ElementRef, provide } from '@angular/core';
import * as D3 from 'd3';

import { ChartConfig } from './chart-config.component';

@Component({
  selector: 'line-graph',
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  inputs: [ 'config', 'indicator' ],
  styleUrls: [ '../../assets/css/chart.css'],
  directives: [ ChartConfig ],
})

export class LineGraph {

  public config: Object;
  public indicator: String;

  private host;        // D3 object referebcing host dom object
  private svg;         // SVG in which we will print our chart
  private margin;      // Space between the svg borders and the actual chart graphic
  private width;       // Component width
  private height;      // Component height
  private xScale;      // D3 scale in X
  private yScale;      // D3 scale in Y
  private xAxis;       // D3 X Axis
  private yAxis;       // D3 Y Axis
  private htmlElement; // Host HTMLElement
  private valueline;   // The charted line
  private data;        // Isolated data

  /* We request angular for the element reference
  * and then we create a D3 Wrapper for our host element
  */
  constructor(private element: ElementRef) {
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.element.nativeElement);
  }

  /* Will Update on every @Input change */
  ngOnChanges(): void {
    if (!this.config || this.config.length === 0) return;
    this.filterData();
    this.setup();
    this.buildSVG();
    this.setAxisScales();
    this.populate();
    this.drawXAxis();
    this.drawYAxis();
  }

  onResize(event): void {
    this.ngOnChanges();
  }

  private filterData(): void {
    var indicator = this.indicator;
    this.data = _.find(this.config, function(obj){
      return obj["indicator"] == indicator;
    })["data"];
  }

  /* Will setup the chart container */
  private setup(): void {
    this.margin = { top: 20, right: 20, bottom: 40, left: 40 };
    this.width = $(".chart").width() - this.margin.left - this.margin.right;
    this.height = 200 - this.margin.top - this.margin.bottom;
    this.xScale = D3.scaleTime().range([0, this.width]);
    this.yScale = D3.scaleLinear().range([this.height, 0]);
    this.valueline = D3.line()
      .x(function(d) { return this.xScale(d.date); })
      .y(function(d) { return this.yScale(d.value); });
  }

  /* Will build the SVG Element */
  private buildSVG(): void {
    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  // Set axis scales
  private setAxisScales(): void {
    var parseTime = D3.timeParse("%Y-%m-%d");
    this.data.forEach(function(d) {
      d.date = parseTime(d.date);
    });
    this.xScale.domain(D3.extent(this.data, function(d) { return d.date; }));
    this.yScale.domain([0, D3.max(this.data, function(d) { return d.value; })]);
  }

  /* Will draw the X Axis */
  private drawXAxis(): void {
    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(D3.axisBottom(this.xScale)
            .ticks(5)
            .tickFormat(D3.timeFormat("%m-%Y")));
  }

  /* Will draw the Y Axis */
  private drawYAxis(): void {
    this.svg.append('g')
      .call(D3.axisLeft(this.yScale)
            .ticks(6));
  }

  /* Will populate datasets into areas*/
  private populate(): void {
  }
}