import { Component, OnInit } from '@angular/core';

import { ChartData } from '../models/chart.models';
import { ChartService } from '../services/chart.service';
import { ChartComponent } from './chart.component';

/*
 * Charts container component
 * Holds all the charts
 */
@Component({
  selector: 'charts',
  template: `<div class="chart" *ngFor="let chart of chartList">
                <chart [indicator]="chart" [chartData]="chartData" (onRemoveChart)="removeChart($event)"></chart>
            </div>`
})
export class ChartsContainerComponent extends OnInit {
    private chartList: Array<String>;
    private chartData: Array<ChartData>;

    constructor(private chartService: ChartService) {
      super();
    }

    removeChart(indicator) {
      this.chartService.removeChart(indicator);
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
