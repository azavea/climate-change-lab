import { Component, ViewEncapsulation, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ChartData, DataPoint } from '../models/chart';
import { Indicator } from '../models/indicator.models';
import * as D3 from 'd3';
import * as _ from 'lodash';
import * as $ from 'jquery';

import { ChartService } from '../services/chart.service';

/*
 * Line graph component
 * Contains all logic for drawing a line graph
 */
@Component({
  selector: 'line-graph',
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  inputs: [ 'data', 'indicator', 'trendline', 'min', 'max', 'minVal', 'maxVal', 'hover', 'multiChartScrubber' ]
})

export class LineGraphComponent implements OnInit, OnDestroy {

    public data: ChartData[];
    public extractedData: Array<DataPoint>;
    public indicator: Indicator;
    public trendline: Boolean;
    public min: Boolean;
    public max: Boolean;
    public minVal: number;
    public maxVal: number;
    public hover: Boolean;
    public multiChartScrubber: Boolean;

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
    private yData: Array<number>;          // Stores primary y axis data, multi-use
    private trendData: Array<DataPoint>;   // Formatted data for the trendline
    private scrubber;                      // Lump of scrubber elements
    private scrubberLine;                  // Scrubber element, independent
    private timeOptions: any;
    private timeFormat: string;
    private id: string;                    // Randomly generated int # used to distinguish the chart for drawing and isolated chart scrubber
                                           // Not a perfect solution should the random int and indicator be the same
                                           // However, this is quite unlikely (1/10000, and even less likely by way of app use)

    private multiChartScrubberHoverSubscription;
    private multiChartScrubberInfoSubscription;

    /* We request angular for the element reference
    * and then we create a D3 Wrapper for our host element
    */
    constructor(private element: ElementRef, private chartService: ChartService) {
        this.htmlElement = this.element.nativeElement;
        this.host = D3.select(this.element.nativeElement);
        this.timeOptions = {
          'yearly': '%Y',
          'daily': '%Y-%m-%d',
          'monthly': '%Y-%m'
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.ngOnChanges();
    }

    // If the chart is being hovered over, handle mouse movements
    @HostListener('mousemove', ['$event'])
    onMouseMove(event) {
        // for single-chart scrubber
        if (this.hover && !this.multiChartScrubber) {
            this.redrawScrubber(event);
        }
        // for multi-chart scrubber
        if (this.multiChartScrubber) {
            this.chartService.updateMultiChartScrubberInfo(event);
        }
    }

    /* Executes on every @Input change */
    ngOnChanges(): void {
        if (!this.data || this.data.length === 0) return;
        this.filterData();
        this.setup();
        this.buildSVG();
        this.setLineScales();
        this.drawGrid();
        this.drawMinMaxBand();
        this.drawTrendLine();
        this.drawThresholds();
        this.drawXAxis();
        this.drawYAxis();
        this.drawAvgLine();
        this.drawScrubber();
    }

    ngOnInit(): void {
        // Set up global chart mouseover communication chain if set to multi-chart scrubber
        // ** CURRENTLY ONLY FOR YEARLY INDICATORS**
        if (this.multiChartScrubber && this.indicator.time_aggregation === 'yearly') {
            this.multiChartScrubberHoverSubscription = this.chartService.multiChartScrubberHoverObservable.subscribe(data => {
                this.hover = data;
                this.hover ? $('.' + this.id).toggleClass('hidden', false) : $('.' + this.id).toggleClass('hidden', true);
            });
            this.multiChartScrubberInfoSubscription = this.chartService.multiChartScrubberInfoObservable.subscribe(event => {
                // Only redraw if a chart is moused over
                if (this.hover) {
                    this.redrawScrubber(event)
                }
            });
        }
    }

    ngOnDestroy(): void {
        if (this.multiChartScrubber && this.indicator.time_aggregation === 'yearly') {
            this.multiChartScrubberInfoSubscription.unsubscribe();
            this.multiChartScrubberHoverSubscription.unsubscribe();
        }
    }

    private filterData(): void {
        // Preserves parent data by fresh copying indicator data that will undergo processing
        let clippedData = _.cloneDeep(_.find(this.data, obj => obj.indicator.name === this.indicator.name));
        if (clippedData) {
            this.timeFormat = this.timeOptions[clippedData.time_agg];
        }
        _.has(clippedData, 'data') ? this.extractedData = clippedData['data'] : this.extractedData = [];
        // Remove empty day in non-leap years (affects only daily data)
        if (this.extractedData[365] && this.extractedData[365]['date'] == null) {
            this.extractedData.pop();
        }
    }

    /* Will setup the chart basics */
    private setup(): void {
        this.margin = { top: 20, right: 50, bottom: 40, left: 50 };
        this.width = $('.chart').width() - this.margin.left - this.margin.right;
        this.height = 200 - this.margin.top - this.margin.bottom;
        this.xScale = D3.scaleTime().range([0, this.width]);
        this.yScale = D3.scaleLinear().range([this.height, 0]);
        this.id = this.indicator.name + (Math.round(Math.random() * 10000)).toString();
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

    // Set axis and line scales
    private setLineScales(): void {
        // Time scales only recognize annual and daily data
        var parseTime = D3.timeParse(this.timeFormat);
        this.extractedData.forEach(d => d.date = parseTime(d.date));

        // Sort data by date ascending
        this.extractedData.sort(function(a, b) {return a.date - b.date;});
        // Parse out avg data for ease of use later
        this.yData = _.map(this.extractedData, d => d.values.avg);

        this.xRange = D3.extent(this.extractedData, d => d.date);
        this.xScale.domain(this.xRange);

        // Adjust y scale, prettify graph
        const minY = D3.min(_.map(this.extractedData, d => d.values.min));
        const maxY = D3.max(_.map(this.extractedData, d => d.values.max));
        const yPad = (maxY - minY) > 0 ? (maxY - minY) * 1/3 : 5; // Note: 5 as default is arbitrary
        // if minY is 0, keep it that way
        this.yScale.domain([minY == 0 ? minY : minY - yPad, maxY + yPad]);

        // Expects line data as DataPoint[]
        this.valueline = D3.line()
          .x(d => this.xScale(d.date))
          .y(d => this.yScale(d.value));
    }

    /* Will draw the X Axis */
    private drawXAxis(): void {
        this.svg.append('g')
          .attr('transform', 'translate(0,' + this.height + ')')
          .attr('class', 'axis')
          .call(D3.axisBottom(this.xScale)
              .ticks(5)
              .tickSize(0)
              .tickFormat(D3.timeFormat(this.timeFormat)))
          .selectAll('text')
          .attr('y', 10);
    }

    /* Will draw the Y Axis */
    private drawYAxis(): void {
        this.svg.append('g')
          .attr('class', 'axis')
          .call(D3.axisLeft(this.yScale)
              .tickSize(0)
              .ticks(5))
          .selectAll('text')
          .attr('x', -10);
    }

    private drawGrid(): void {
        this.svg.append('g')
            .attr('class', 'grid line')
            .call(this.makeXGridlines()
                .tickSize(this.height)
                .tickFormat(""));

        this.svg.append('g')
            .attr('class', 'grid line')
            .call(this.makeYGridlines()
                .tickSize(-this.width)
                .tickFormat(""));
    }

    private makeXGridlines() {
        return D3.axisBottom(this.xScale)
            .ticks(5);
    }

    private makeYGridlines() {
        return D3.axisLeft(this.yScale)
            .ticks(5);
    }

    /* Draw line */
    private drawAvgLine(): void {
        let data = _.map(this.extractedData, d => ({'date': d.date, 'value': d.values.avg }));
        this.drawLine(data, 'line');
    }

    private drawTrendLine(): void {
        // Only draw if data and add trendline flag
        if (this.trendline && this.extractedData.length) {
            this.xData = D3.range(1, this.yData.length + 1)

            // Calculate linear regression variables
            var leastSquaresCoeff = this.leastSquares(this.xData, this.yData);

            // Apply the results of the regression
            var x1 = this.xRange[1];
            var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
            var x2 = this.xRange[0];
            var y2 = leastSquaresCoeff[0] * this.xData.length + leastSquaresCoeff[1];
            this.trendData = [{'date': x1, 'value': y2}, {'date': x2, 'value': y1}];
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

    private drawMinMaxBand(): void {
        let area = D3.area()
            .x(d => this.xScale(d.date))
            .y0(d => this.yScale(d.min))
            .y1(d => this.yScale(d.max));

        let minMaxData = _.map(this.extractedData, d => ({'date': d.date,
                                                          'min': d.values.min,
                                                          'max': d.values.max}));

        // Draw min/max area
        this.svg.append('path')
          .data([minMaxData])
          .attr('class', 'area')
          .attr('d', area);
    }

    private drawThresholds(): void {
        if (this.min || this.max) {
            // Prepare standard variables
            let x1 = this.xRange[1];
            let x2 = this.xRange[0];
            let y = D3.max(this.yData);
            if (this.min) {
                // Draw min threshold line
                let minData = [{'date': x1, 'value': this.minVal}, {'date': x2, 'value': this.minVal}];

                // Prepare data for bar graph
                let minBars = _(this.extractedData)
                              .map((datum, index) => ({ 'date': datum['date'] }))
                              .filter((bar, index) => this.minVal > this.yData[index])
                              .value();

                // Add bar graph
                this.drawBands(minBars, 'min-bar');
            }

            if (this.max) {
                // Draw max threshold line
                let maxData = [{'date': x1, 'value': this.maxVal}, {'date': x2, 'value': this.maxVal}];

                // Prepare data for bar graph
                let maxBars = _(this.extractedData)
                              .map((datum, index) => ({ 'date': datum['date'] }))
                              .filter((bar, index) => this.maxVal < this.yData[index])
                              .value();

                // Add bar graph
                this.drawBands(maxBars, 'max-bar');
            }
        }
    }

    private drawScrubber(): void {
        // Vertical scrub line. Exists outside scrubber cluster because it moves independently
        this.svg.append('line')
            .attr('class', 'scrubline' + ' ' + this.id)
            .attr('x1', 0).attr('x2', 0)
            .attr('y1', 0).attr('y2', this.height)
            .classed('hidden', true);

        // Other scrubber elements
        this.scrubber = this.svg.append('g')
            .attr('class', this.id)
            .classed('hidden', true);

        this.scrubber.append('circle')
            .attr('r', 4.5);

        this.scrubber.append('rect')
            .attr('class', 'scrubber-box' + ' ' + this.id)
            .attr('height', 20);

        this.scrubber.append('text')
            .attr('class', 'scrubber-text' + ' ' + this.id);

        // Scrubber sensory zone (set to size of graph) intentionally drawn last
        // It overlays all other svg elements for uncompromised mouseover detection
        this.svg.append('rect')
            .attr('id', 'overlay')
            .attr('height', this.height)
            .attr('width', this.width);

        // Toggle scrubber visibility
        this.hover ? $('.' + this.id).toggleClass('hidden', false) : $('.' + this.id).toggleClass('hidden', true);
    }

    private redrawScrubber(event) {
        let xPos = event.offsetX - this.margin.left;
        // Firefox handles event positioning differently than Chrome, Safari
        if (navigator && navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
            xPos = event.offsetX;
        }

        // Quit if mouse outside chart bounds; Eliminates most heinous flashing misbehavior in Firefox too
        if (xPos < 0 || xPos > this.width) { return; }

        // Default round down position to existing time point
        // Note the +unary operator before dates. Converts dates to numbers to quell tslinter
        let bisectDate = D3.bisector(function(d) { return d.date; }).left;
        let x0 = this.xScale.invert(xPos),
            i = +bisectDate(this.extractedData, x0, 1),
            d0 = this.extractedData[i - 1],
            d1 = this.extractedData[i],
            d: number;

        // Prevent error leaving graph
        if (d0 && d1) {
            d = x0 - +d0.date > +d1.date - x0 ? i : i-1;
        } else {
            d = i-1;
        }

        let yDatum = this.yData[d];

        // Move scubber elements
        this.scrubber.attr('transform', 'translate(' + xPos + ',' + this.yScale(yDatum) + ')');
        this.svg.selectAll('.scrubline').attr('transform', 'translate(' + xPos + ',' + 0 + ')');

        // Update scrubber text
        let labelText = yDatum.toFixed(2) + ' ' + this.data[0]['indicator']['default_units'];
        let textSVG = D3.select('.scrubber-text.' + this.id).text(labelText);

        // Center text
        let labelWidth = textSVG.node().getBBox().width;
        textSVG.attr('transform', 'translate(' + -labelWidth/2 + ',' + -15 + ')');

        // Update text box length
        D3.select('.scrubber-box.' + this.id)
            .attr('width', labelWidth + 10)
            .attr('transform', 'translate(' + -(labelWidth/2 + 5) + ',' + -30 + ')');
    }

    private drawLine(data: Array<DataPoint>, className: string): void {
        this.svg.append('path')
            .data([data])
            .attr('class', className)
            .attr('d', this.valueline);
    }

    private drawBands(data: Array<DataPoint>, className: string): void {
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
            .attr('y', 0)
            .attr('height', this.height);
    }
}
