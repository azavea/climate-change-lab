import { Component, ViewEncapsulation, ElementRef } from '@angular/core';
import { ChartData, DataPoint } from '../models/chart.models';
import * as D3 from 'd3';
import * as _ from 'lodash';
import * as $ from 'jquery';

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
  public indicator: string;
  public trendline: Boolean;
  public min: Boolean;
  public max: Boolean;
  public minVal: number;
  public maxVal: number;

  private host;                          // D3 object referebcing host dom object
  private svg;                           // SVG in which we will print our chart
  private margin;                        // Space between the svg borders and the actual chart graphic
  private width;                         // Component width
  private height;                        // Component height
  private xScale;                        // D3 scale in X
  private yScale;                        // D3 scale in Y
  private htmlElement;                   // Host HTMLElement
  private valueline;                     // Base for a chart line
  private xRange: Array<string>;         // Min, max date range
  private xData: Array<number>;          // Stores x axis data as integers rather than dates, necessary for trendline math
  private yData: Array<number>;          // Stores just y axis data, multi-use
  private trendData: Array<DataPoint>;   // Formatted data for the trendline

  /* We request angular for the element reference
  * and then we create a D3 Wrapper for our host element
  */
  constructor(private element: ElementRef) {
    self = this;
    self.htmlElement = self.element.nativeElement;
    self.host = D3.select(self.element.nativeElement);
  }

  /* Will Update on every @Input change */
  ngOnChanges(): void {
    if (!self.data || self.data.length === 0) return;
    self.filterData();
    self.setup();
    self.buildSVG();
    self.setAxisScales();
    self.drawXAxis();
    self.drawYAxis();
    self.populate();
    self.drawTrendLine();
    self.drawMinMax();
  }

  private filterData(): void {
    var indicator = self.indicator;
    // Preserves parent data by fresh copying indicator data that will undergo processing
    self.extractedData = _.cloneDeep(_.find(self.data, function(obj) {
      return obj["indicator"] == indicator;
    }));
    _.has(self.extractedData, "data")? self.extractedData=self.extractedData["data"] : self.extractedData=[];
    // Remove empty day in non-leap years
    if (self.extractedData[365] && self.extractedData[365]['date'] == null) {
        self.extractedData.pop(365);
    }
    // Parse out data by axis for ease of use later
    self.yData = _.map(self.extractedData, function(d) {
      return d.value;
    });
  }

  /* Will setup the chart basics */
  private setup(): void {
    self.margin = { top: 20, right: 20, bottom: 40, left: 40 };
    self.width = $('.chart').width() - self.margin.left - self.margin.right;
    self.height = 200 - self.margin.top - self.margin.bottom;
    self.xScale = D3.scaleTime().range([0, self.width]);
    self.yScale = D3.scaleLinear().range([self.height, 0]);
  }

  /* Will build the SVG Element */
  private buildSVG(): void {
    self.host.html('');
    self.svg = self.host.append('svg')
                .attr('width', self.width + self.margin.left + self.margin.right)
                .attr('height', self.height + self.margin.top + self.margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');
  }

  // Set axis scales
  private setAxisScales(): void {
    var parseTime = D3.timeParse("%Y-%m-%d");
    self.extractedData.forEach(function(d) {
      d.date = parseTime(d.date);
    });

    self.xRange = D3.extent(self.extractedData, function(d) { return d.date; });
    self.xScale.domain(self.xRange);
    self.yScale.domain([0, D3.max(self.yData)]);
  }

  /* Will draw the X Axis */
  private drawXAxis(): void {
    self.svg.append('g')
      .attr('transform', 'translate(0,' + self.height + ')')
      .call(D3.axisBottom(self.xScale)
      .ticks(5)
      .tickFormat(D3.timeFormat("%m-%Y")));
  }

  /* Will draw the Y Axis */
  private drawYAxis(): void {
    self.svg.append('g')
      .call(D3.axisLeft(self.yScale)
      .ticks(6));
  }

  /* Draw line */
  private populate(): void {
    self.valueline = D3.line()
                      .x(function(d) { return self.xScale(d.date); })
                      .y(function(d) { return self.yScale(d.value); });

    self.drawLine(self.extractedData, "line");
  }

  private drawTrendLine(): void {
    // Only draw if data and add trendline flag
    if (self.trendline && self.extractedData.length) {
      // Set up if first time
      if (!self.trendData) {
          self.xData = D3.range(1, self.yData.length + 1)

        // Calculate linear regression variables
        var leastSquaresCoeff = self.leastSquares(self.xData, self.yData);

        // Apply the results of the regression
        var x1 = self.xRange[1];
        var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
        var x2 = self.xRange[0];
        var y2 = leastSquaresCoeff[0] * self.xData.length + leastSquaresCoeff[1];
        self.trendData = [{"date":x1, "value":y1}, {"date": x2, "value":y2}];
      }
      // Add trendline
      self.drawLine(self.trendData, "trendline");
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

  private drawMinMax(): void {
    if (self.min || self.max) {
      // Prepare standard variables
      var x1 = self.xRange[1];
      var x2 = self.xRange[0];
      var y = D3.max(self.yData)/2;
      var xscale = D3.scaleBand()
                    .range([0, self.width])
                    .padding(0)
                    .domain(self.extractedData.map(function(d) { return d.date; }));

      if (self.min && self.minVal) {
        // Draw min threshold line
        var minData = [{"date":x1, "value": self.minVal }, {"date": x2, "value": self.minVal }];
        self.drawLine(minData, "minline");

        // Prepare data for bar graph
        var minBars = self.extractedData.map(function(datum) {
            var val;
            self.minVal > datum["value"]? val = y*2 : val = 0;
            return { "date": datum["date"], "value": val }
        });

        // Add bar graph
        self.svg.selectAll(".min-bar")
          .data(minBars)
          .enter().append("rect")
          .attr("class", "min-bar")
          .attr("x", function(d) { return xscale(d.date); })
          .attr("width", xscale.bandwidth())
          .attr("y", function(d) { return self.yScale(d.value); })
          .attr("height", function(d) { return self.height - self.yScale(d.value); });
      }

      if (self.max && self.maxVal) {
        // Draw max threshold line
        var maxData = [{"date":x1, "value": self.maxVal }, {"date": x2, "value": self.maxVal}];
        self.drawLine(maxData, "maxline");

        // Prepare data for bar graph
        var maxBars = self.extractedData.map(function(datum) {
            var val;
            self.maxVal < datum["value"]? val = y*2 : val = 0;
            return { "date": datum["date"], "value": val }
        })

        // Add bar graph
        self.svg.selectAll(".max-bar")
          .data(maxBars)
          .enter().append("rect")
          .attr("class", "max-bar")
          .attr("x", function(d) { return xscale(d.date); })
          .attr("width", xscale.bandwidth())
          .attr("y", function(d) { return self.yScale(d.value); })
          .attr("height", function(d) { return self.height - self.yScale(d.value); });
      }
    }
  }

  private drawLine(data: Array<DataPoint>, className: String): void {
    self.svg.append("path")
      .data([data])
      .attr("class", className)
      .attr("d", self.valueline);
  }
}
