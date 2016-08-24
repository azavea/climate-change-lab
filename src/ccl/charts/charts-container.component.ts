import { Component, OnInit } from '@angular/core';

import { ChartData } from '../models/chart.models';
import { ChartService } from '../services/chart.service';
import { Chart } from './chart.component';

/*
 * Charts container component
 * Holds all the charts
 */

@Component({
  selector: 'charts',
  directives: [Chart],
  template: `<div class="chart" *ngFor="let chart of chartList">
                <chart [indicator]="chart" [chartData]="chartData"></chart>
            </div>`
})

export class Charts extends OnInit {

    private chartList: Array<String>;
    private chartData: ChartData[];

    constructor(private chartService: ChartService){
      super();
    }

    makeCharts() {

      // FIXME: using dummy options for API query
      let options = {
        cityId: 1,
        scenario: 'RCP85',
        variables: 'pr',
        years: '2070'
      };

      this.chartService.getChartData(options).subscribe(data=> {
        this.chartData = data;
      });
    }

    ngOnInit() {
      // First, subscribe to chartList observable
      this.chartList = this.chartService.get();
      this.makeCharts();
    }

}

