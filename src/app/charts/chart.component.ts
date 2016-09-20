import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { WaveComponent } from '../ng2-spin-kit/wave.component';

import { Chart } from '../models/chart';
import { Indicator } from '../models/indicator.models';

import { LineGraphComponent } from './line-graph.component';

/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'chart',
  inputs: ['chart', 'chartData'],
  templateUrl: './chart.component.html'
})

export class ChartComponent implements OnInit {

    @Output() onRemoveChart = new EventEmitter<Chart>();

    private chart: Chart;


    ngOnInit() {

    }

    removeChart(chart) {
        this.onRemoveChart.emit(chart);
    }
}
