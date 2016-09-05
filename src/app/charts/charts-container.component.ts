import { Component, OnInit } from '@angular/core';

import { ChartService } from '../services/chart.service';
import { ChartComponent } from './chart.component';

/*
 * Charts container component
 * Holds all the charts
 */
@Component({
  selector: 'charts',
  directives: [ChartComponent],
  template: `<div class="chart" *ngFor="let chart of chartList">
                <chart [indicator]="chart"></chart>
            </div>`
})
export class ChartsContainerComponent extends OnInit {
    private chartList: Array<String>;

    constructor(private chartService: ChartService) {
      super();
    }

    ngOnInit() {
      // First, subscribe to chartList observable
      this.chartList = this.chartService.get();
    }
}
