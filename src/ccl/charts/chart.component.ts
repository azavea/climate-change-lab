import { Component } from '@angular/core';

import { LineGraph } from './line-graph.component';

/*
 * Chart component
 * Container for each individual chart plus controls
 */

@Component({
  selector: 'chart',
  directives: [LineGraph],
  inputs: ['indicator', 'chartData'],
  styleUrls: [
    './chart.component.css',
  ],
  templateUrl: './chart.component.html'
})
export class Chart {
  private trendline: Boolean;

  toggleTrendline() {
    this.trendline = !this.trendline;
  }

  constructor() {
    this.trendline = false;
  }
}