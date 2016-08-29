import { Component, ViewEncapsulation, ElementRef } from '@angular/core';
import { ChartData, DataPoint } from '../models/chart.models';
import * as D3 from 'd3';
import * as _ from 'lodash';

/*
 * Line graph component
 * Contains all logic for drawing a line graph
 */
@Component({
  selector: 'line-graph',
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  inputs: [ 'data', 'indicator', 'trendline', 'min', 'max', 'minVal', 'maxVal' ]
})
export class LineGraphComponent {
  public data: ChartData[];
  public extractedData: Array<DataPoint>;
  public indicator: String;
  public trendline: Boolean;
  public min: Boolean;
  public max: Boolean;
  public minVal: any;
  public maxVal: any;

  private host;                          // D3 object referebcing host dom object
  private svg;                           // SVG in which we will print our chart
  private margin;                        // Space between the svg borders and the actual chart graphic
  private width;                         // Component width
  private height;                        // Component height
  private xScale;                        // D3 scale in X
  private yScale;                        // D3 scale in Y
  private htmlElement;                   // Host HTMLElement
  private valueline;                     // Base for a chart line
  private xRange: Array<String>;         // Min, max date range
  private xData: Array<number>;          // Stores x axis data as integers rather than dates, necessary for trendline math
  private yData: Array<number>;          // Stores just y axis data, multi-use
  private trendData: Array<DataPoint>;   // Formatted data for the trendline

  /* We request angular for the element reference
  * and then we create a D3 Wrapper for our host element
  */
  constructor(private element: ElementRef) {
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.element.nativeElement);
  }

  /* Will Update on every @Input change */
  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) return;
    this.filterData();
    this.setup();
    this.buildSVG();
    this.setAxisScales();
    this.drawXAxis();
    this.drawYAxis();
    this.populate();
    this.drawTrendLine();
    // Temporarily here to show chart control statuses
    console.log("Min: " + this.min, this.minVal + "; Max: " + this.max, this.maxVal);
  }

  private filterData(): void {
    var indicator = this.indicator;
    // Preserves parent data by fresh copying indicator data that will undergo processing
    this.extractedData = _.cloneDeep(_.find(this.data, function(obj) {
      return obj["indicator"] == indicator;
    }));
    _.has(this.extractedData, "data")? this.extractedData=this.extractedData["data"] : this.extractedData=[];
    // Parse out data by axis for ease of use later
    this.yData = _.map(this.extractedData, function(d) {
      return d.value;
    });

    // Convert string input to numbers
    this.minVal = Number(this.minVal);
    this.maxVal = Number(this.maxVal);
  }

  /* Will setup the chart basics */
  private setup(): void {
    this.margin = { top: 20, right: 20, bottom: 40, left: 40 };
    this.width = $(".chart").width() - this.margin.left - this.margin.right;
    this.height = 200 - this.margin.top - this.margin.bottom;
    this.xScale = D3.scaleTime().range([0, this.width]);
    this.yScale = D3.scaleLinear().range([this.height, 0]);
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
    this.extractedData.forEach(function(d) {
      d.date = parseTime(d.date);
    });

    this.xRange = D3.extent(this.extractedData, function(d) { return d.date; });
    this.xScale.domain(this.xRange);
    this.yScale.domain([0, D3.max(this.yData)]);
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

  /* Draw line */
  private populate(): void {
    var xscale = this.xScale;
    var yscale = this.yScale;
    this.valueline = D3.line()
      .x(function(d) { return xscale(d.date); })
      .y(function(d) { return yscale(d.value); });

    this.svg.append("path")
      .data([this.extractedData])
      .attr("class", "line")
      .attr("d", this.valueline);
  }

  private drawTrendLine(): void {
    // Only draw if data and add trendline flag
    if (this.trendline && this.extractedData.length) {
      // Set up if first time
      if (!this.trendData) {
          this.xData = D3.range(1, this.yData.length + 1)

        // Calculate linear regression variables
        var leastSquaresCoeff = this.leastSquares(this.xData, this.yData);

        // Apply the results of the regression
        var x1 = this.xRange[1];
        var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
        var x2 = this.xRange[0];
        var y2 = leastSquaresCoeff[0] * this.xData.length + leastSquaresCoeff[1];
        this.trendData = [{"date":x1, "value":y1},{"date": x2, "value":y2}];
      }
      // Add trendline
      this.svg.append("path")
        .data([this.trendData])
        .attr("class", "trendline")
        .attr("d", this.valueline);
    }
  }

  // returns slope, intercept and r-square of the line
  private leastSquares(xData: Array<number>, yData: Array<number>): Array<number> {
    var reduceSumFunc = function(prev, cur) { return prev + cur; };

    var xBar = xData.reduce(reduceSumFunc) * 1.0 / xData.length;
    var yBar = yData.reduce(reduceSumFunc) * 1.0 / yData.length;
    var ssXX = xData.map(function(d) { return Math.pow(d - xBar, 2); })
      .reduce(reduceSumFunc);

    var ssYY = yData.map(function(d) { return Math.pow(d - yBar, 2); })
      .reduce(reduceSumFunc);

    var ssXY = xData.map(function(d, i) { return (d - xBar) * (yData[i] - yBar); })
      .reduce(reduceSumFunc);

    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return [slope, intercept, rSquare];
  }

}
