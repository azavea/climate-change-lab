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
        this.drawMinMax();
    }

    private filterData(): void {
        let indicator = this.indicator.name;
        // Preserves parent data by fresh copying indicator data that will undergo processing
        this.extractedData = _.cloneDeep(_.find(this.data, obj => obj['indicator'] === indicator));
        _.has(this.extractedData, 'data') ? this.extractedData = this.extractedData['data'] : this.extractedData = [];
        // Remove empty day in non-leap years (affects only daily data)
        if (this.extractedData[365] && this.extractedData[365]['date'] == null) {
            this.extractedData.pop();
        }
        // Parse out data by axis for ease of use later
        this.yData = _.map(this.extractedData, d => d.value);
    }

    /* Will setup the chart basics */
    private setup(): void {
        this.margin = { top: 20, right: 20, bottom: 40, left: 40 };
        this.width = $('.chart').width() - this.margin.left - this.margin.right;
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
        // Time scales only recognize annual and daily data
        var parseTime = this.time === "annual"? D3.timeParse('%Y') : D3.timeParse('%Y-%m-%d');
        this.extractedData.forEach(d => d.date = parseTime(d.date));
        this.xRange = D3.extent(this.extractedData, d => d.date);
        this.xScale.domain(this.xRange);
        this.yScale.domain([D3.min(this.yData) - 10, D3.max(this.yData) + 10]);
    }

    /* Will draw the X Axis */
    private drawXAxis(): void {
        this.svg.append('g')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(D3.axisBottom(this.xScale)
          .ticks(5)
          .tickFormat(D3.timeFormat('%m-%Y')));
    }

    /* Will draw the Y Axis */
    private drawYAxis(): void {
        this.svg.append('g')
          .call(D3.axisLeft(this.yScale)
          .ticks(6));
    }

    /* Draw line */
    private populate(): void {
        this.valueline = D3.line()
          .x(d => this.xScale(d.date))
          .y(d => this.yScale(d.value));

        this.drawLine(this.extractedData, 'line');
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
              this.trendData = [{'date': x1, 'value': y1}, {'date': x2, 'value': y2}];
          }
          // Add trendline
          this.drawLine(this.trendData, 'trendline');
        }
    }

    // returns slope, intercept and r-square of the line
    private leastSquares(xData: Array<number>, yData: Array<number>): Array<number> {
        var reduceSumFunc = function(prev, cur) { return prev + cur; };

        var xBar = xData.reduce(reduceSumFunc) * 1.0 / xData.length;
        var yBar = yData.reduce(reduceSumFunc) * 1.0 / yData.length;
        var ssXX = _.map(xData, d => Math.pow(d - xBar, 2))
                    .reduce(reduceSumFunc);

        var ssYY = _.map(yData, d => Math.pow(d - yBar, 2))
                    .reduce(reduceSumFunc);

        var ssXY = _.map(xData, (d, i) => (d - xBar) * (yData[i] - yBar))
                    .reduce(reduceSumFunc);

        var slope = ssXY / ssXX;
        var intercept = yBar - (xBar * slope);
        var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

        return [slope, intercept, rSquare];
    }

    private drawMinMax(): void {
        if (this.min || this.max) {
            // Prepare standard variables
            let x1 = this.xRange[1];
            let x2 = this.xRange[0];
            let y = D3.max(this.yData) / 2;

            if (this.min && this.minVal) {
                // Draw min threshold line
                let minData = [{'date': x1, 'value': this.minVal}, {'date': x2, 'value': this.minVal}];
                this.drawLine(minData, 'minline');

                // Prepare data for bar graph
                let minBars = _.map(this.extractedData, datum => {
                    let val = this.minVal > datum['value'] ? y * 2 : 0;
                    return { 'date': datum['date'], 'value': val };
                });

                // Add bar graph
                this.drawBarGraph(minBars, 'min-bar');
            }

            if (this.max && this.maxVal) {
                // Draw max threshold line
                let maxData = [{'date': x1, 'value': this.maxVal}, {'date': x2, 'value': this.maxVal}];
                this.drawLine(maxData, 'maxline');

                // Prepare data for bar graph
                let maxBars = _.map(this.extractedData, datum => {
                    let val = this.maxVal < datum['value'] ? y * 2 : 0;
                    return { 'date': datum['date'], 'value': val }
                });

                // Add bar graph
                this.drawBarGraph(maxBars, 'max-bar');
            }
        }
    }

    private drawLine(data: Array<DataPoint>, className: string): void {
        this.svg.append('path')
          .data([data])
          .attr('class', className)
          .attr('d', this.valueline);
    }

    private drawBarGraph(data: Array<DataPoint>, className: string): void {
        let xscale = D3.scaleBand()
          .range([0, this.width])
          .padding(0)
          .domain(_.map(this.extractedData, d => d.date));

        this.svg.selectAll('.' + className)
          .data(data)
          .enter().append('rect')
          .attr('class', className)
          .attr('x', d => xscale(d.date))
          .attr('width', xscale.bandwidth())
          .attr('y', d => this.yScale(d.value))
          .attr('height', d => this.height - this.yScale(d.value));
    }
}
