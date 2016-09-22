import { Component, EventEmitter, ViewEncapsulation, OnInit, Output } from '@angular/core';

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

    @Output() onIndicatorSelected = new EventEmitter<Indicator>();

    private yearlyIndicators: Indicator[];

    constructor(private indicatorService: IndicatorService) {
      super();
    }

    onIndicatorClicked(indicator: Indicator) {
        this.onIndicatorSelected.emit(indicator);
    }

    ngOnInit() {
      this.indicatorService.list().subscribe(data => {
          this.yearlyIndicators = data.filter(i => i.time_aggregation === 'yearly');
      });
    }
}
