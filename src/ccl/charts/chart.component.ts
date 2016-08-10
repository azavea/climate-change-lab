import { Component, Inject, OnInit } from '@angular/core';

import { ChartService } from '../services/chart.service';
import { LineGraph } from './line-graph.component';

/*
 * Chart component
 * Management for the sections that appear in the chart container
 */

@Component({
  selector: 'charts',
  directives: [LineGraph],
  styleUrls: [
    './chart.style.css',
  ],
  templateUrl: './chart.template.html'
})
export class Chart extends OnInit {

    private chartList;
    private chartData;

    constructor(private chartService: ChartService){
    }

    makeCharts() {
      this.chartService.getChartData().subscribe(data=> {
        this.chartData = data;
      });
    }

    ngOnInit() {
      // First, subscribe to chartList observable
      this.chartList = this.chartService.get();
      this.makeCharts();
    }

}