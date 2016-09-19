import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { ChartService } from '../services/chart.service';
import { IndicatorService } from '../services/indicator.service';
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

    constructor(private chartService: ChartService, private indicatorService: IndicatorService) {
      super();
    };

    // Set up click event handlers
    onIndicatorClicked(indicator) {
      // TODO: once indicator in place for raw data queries, change to pass Indicator object
      this.chartService.addChart(indicator);
    }

    ngOnInit() {
      this.indicatorService.list().subscribe(data => {
          this.yearlyIndicators = data.filter(i => i.time_aggregation === 'yearly');
      });
    }
}
