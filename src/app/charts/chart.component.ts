import { Component } from '@angular/core';

import { Indicator } from '../models/indicator.models';
import { LineGraphComponent } from './line-graph.component';

/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'chart',
  inputs: ['indicator', 'chartData'],
  templateUrl: './chart.component.html'
})

export class ChartComponent {

    private indicator: Indicator;
    private isCollapsed: boolean;
    private trendline: boolean;
    private min: boolean;
    private max: boolean;
    private minVal: number;
    private maxVal: number;

    toggleTrendline () {
        this.trendline = !this.trendline;
    }

    toggleMin () {
        this.min = !this.min;
    }

    toggleMax () {
        this.max = !this.max;
    }

    constructor() {
        this.isCollapsed = false;
        this.trendline = false;
        this.min = false;
        this.max = false;
        this.minVal = 0;
        this.maxVal = 0;
    }
}
