import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Indicator } from '../models/indicator.model';

/*
 * IndicatorList Component
 * Displays list of indicators with configurable action on click
 */

@Component({
  selector: 'ccl-indicator-list',
  templateUrl: './indicator-list.component.html'
})
export class IndicatorListComponent {

    @Input() indicators: Indicator[];
    @Output() indicatorClicked = new EventEmitter<Indicator>();

    onIndicatorClicked(indicator: Indicator) {
        this.indicatorClicked.emit(indicator);
    }
}
