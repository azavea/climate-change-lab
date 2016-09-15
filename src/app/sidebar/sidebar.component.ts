import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { ChartService } from '../services/chart.service';
import { IndicatorsService } from '../services/indicators.service';
import { Indicator } from '../models/indicator.models';

/*
 * Sidebar Component
 * Populates sidebar with indicators and triggers adding charts
 */

@Component({
  selector: 'sidebar',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent extends OnInit {
    private yearlyIndicators: Indicator[];

    constructor(private chartService: ChartService, private indicatorsService: IndicatorsService) {
      super();
    };

    // Set up click event handlers
    onIndicatorClicked(indicator) {
      // TODO: once indicator in place for raw data queries, change to pass Indicator object
      this.chartService.addChart(indicator);
    }

    ngOnInit() {
      this.indicatorsService.loadIndicators();
      this.indicatorsService.get().subscribe(data => {
          this.yearlyIndicators = data.filter(i => i.time_aggregation === 'yearly');
      });
    }
}
