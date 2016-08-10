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
  styleUrls: [
      './sidebar.style.css',
  ],
  templateUrl: './sidebar.template.html'
})
export class Sidebar extends OnInit {
    private indicatorsList: string;

    constructor(private chartService: ChartService, private indicatorService: IndicatorsService) {};

    // Set up click event handlers
    onIndicatorClicked(indicator) {
        this.chartService.addChart(indicator);
    }

    ngOnInit() {
      this.indicatorService.get()
      .subscribe(data=>this.indicatorsList=data);
    }

}
