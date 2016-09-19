import { Component, OnInit } from '@angular/core';

import { Chart, ChartData } from '../models/chart';
import { ChartService } from '../services/chart.service';
import { ChartComponent } from './chart.component';

/*
 * Charts container component
 * Holds all the charts
 */
@Component({
  selector: 'charts',
  template: `<div class="chart" *ngFor="let chart of chartList">
                <chart [chart]="chart" [chartData]="chartData" (onRemoveChart)="removeChart($event)"></chart>
            </div>`
})
export class ChartsContainerComponent extends OnInit {
    private chartList: Chart[];
    private chartData: ChartData[];

    constructor(private chartService: ChartService) {
      super();
    }

    removeChart(chart: Chart) {
      this.chartService.removeChart(chart);
      this.chartList = this.chartService.get();
    }

    makeCharts() {
      this.chartList = this.chartService.get();
      this.chartService.loadChartData();
      this.chartService.getChartData().subscribe(data=> {
        this.chartData = data;
      });
    }

    ngOnInit() {
      this.makeCharts();
    }
}
