import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { ChartService } from '../services/chart.service';
import { IndicatorsService } from '../services/indicators.service';

/*
 * Sidebar Component
 * Populates sidebar with indicators and triggers adding charts
 */

@Component({
  selector: 'sidebar',
  encapsulation: ViewEncapsulation.None,
  providers: [IndicatorsService],
  templateUrl: './sidebar.component.html'
})
export class Sidebar extends OnInit {
    private indicatorsList: string;

    constructor(private chartService: ChartService, private indicatorsService: IndicatorsService) {
      super();
    };

    // Set up click event handlers
    onIndicatorClicked(indicator) {
        this.chartService.addChart(indicator);
    }

    ngOnInit() {
      this.indicatorsService.get()
      .subscribe(data=>this.indicatorsList=data);
    }

}
