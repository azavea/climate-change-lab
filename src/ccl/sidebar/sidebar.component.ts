/*
 * Climate Change Lab
 * Sidebar component
 */
import { Component, ViewEncapsulation, EventEmitter, Input, Output } from '@angular/core';

import { IndicatorsService } from '../services/indicators.service';
import { ChartService } from '../services/chart.service';


@Component({
  selector: 'sidebar',
  encapsulation: ViewEncapsulation.None,
  providers: [IndicatorsService, ChartService],
  styleUrls: [
      '../../assets/css/sidebar.css',
  ],
  templateUrl: './sidebar.template.html'
})
export class Sidebar {
    private indicatorsList: string;

    // Pull data to populate sidebar
    constructor(private chartService: ChartService, private indicatorService: IndicatorsService){};

    // Set up click event handlers
    onIndicatorClicked(indicator) {
        this.chartService.addChart(indicator);
    }

    ngOnInit() {
      this.indicatorService.get()
      .subscribe(data=>this.indicatorsList=data);
    }

}
