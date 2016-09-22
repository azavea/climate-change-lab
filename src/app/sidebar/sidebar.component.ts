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
export class SidebarComponent implements OnInit {

    @Output() onIndicatorSelected = new EventEmitter<Indicator>();

    private tempIndicators: Indicator[];
    private precipIndicators: Indicator[];

    constructor(private indicatorService: IndicatorService) {}

    onIndicatorClicked(indicator: Indicator) {
        this.onIndicatorSelected.emit(indicator);
    }

    ngOnInit() {
        this.indicatorService.list().subscribe(data => this.groupIndicators(data));
    }

    private groupIndicators(indicators: Indicator[]) {
        this.tempIndicators = indicators.filter(i => {
            return this.isValidIndicator(i) &&
                   (i.variables.indexOf('tasmax') !== -1 || i.variables.indexOf('tasmin') !== -1);
        });
        this.precipIndicators = indicators.filter(i => {
            return this.isValidIndicator(i) && i.variables.indexOf('pr') !== -1;
        });
    }

    private isValidIndicator(indicator: Indicator): boolean {
        return indicator.time_aggregation !== 'daily';
    }
}
