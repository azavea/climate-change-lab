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
    './chart.style.css',
  ],
  templateUrl: './chart.template.html'
})
export class Chart {
}