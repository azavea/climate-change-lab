import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Indicator } from '../models/indicator.models';

/*
 * IndicatorList Component
 * Displays list of indicators with configurable action on click
 */

@Component({
  selector: 'indicator-list',
  templateUrl: './indicator-list.component.html'
})
export class IndicatorListComponent {

    @Input() indicators: Indicator[];
    @Output() indicatorClicked = new EventEmitter<Indicator>();

    constructor() {}

    onIndicatorClicked(indicator: Indicator) {
        this.indicatorClicked.emit(indicator);
    }
}
