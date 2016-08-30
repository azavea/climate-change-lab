import { Component } from '@angular/core';

import { LineGraphComponent } from './line-graph.component';

/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'chart',
  directives: [LineGraphComponent],
  inputs: ['indicator', 'chartData'],
  templateUrl: './chart.component.html'
})
export class ChartComponent {
  private trendline: Boolean;

  toggleTrendline() {
    this.trendline = !this.trendline;
  }

  constructor() {
    this.trendline = false;
  }
}
