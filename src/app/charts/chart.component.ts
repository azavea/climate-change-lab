import { Component, OnInit } from '@angular/core';
import { CollapseDirective, TOOLTIP_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { ChartData } from '../models/chart.models';
import { Indicator } from '../models/indicator.models';
import { ChartService } from '../services/chart.service';
import { LineGraphComponent } from './line-graph.component';

/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'chart',
  directives: [LineGraphComponent, CollapseDirective, TOOLTIP_DIRECTIVES],
  inputs: ['indicator', 'chartData'],
  templateUrl: './chart.component.html'
})

export class ChartComponent extends OnInit {

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

    ngOnInit() {
    }

    constructor(private chartService: ChartService) {
        super();
        this.isCollapsed = false;
        this.trendline = false;
        this.min = false;
        this.max = false;
        this.minVal = 0;
        this.maxVal = 0;
    }
}
