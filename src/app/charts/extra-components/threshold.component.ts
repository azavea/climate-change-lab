import { Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';

import { IndicatorQueryOpts } from '../../models/indicator-query-opts.model';

import * as _ from 'lodash';

/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'ccl-threshold-parameters',
  templateUrl: './threshold.component.html'
})
export class ThresholdComponent implements OnChanges {

    //@Output() onRemoveChart = new EventEmitter<Chart>();

    @Input() threshold: Number;
    @Input() comparator: string;
    @Input() comparators: string[] = ['lte', 'gte', 'ge', 'le'];
    @Input() thresholdUnits: string[] = ['K', 'F', 'C'];
    @Input() thresholdUnit: string;
    @Output() unitSelected = new EventEmitter<string>();
    // TODO: wire up event emitters for the other two as well and listen in chart component?

    public onUnitSelected(unit: string) {
        this.thresholdUnit = unit;
        console.log(unit);
        this.unitSelected.emit(unit);
    }

    public onComparatorSelected(comparator: string) {
        console.log('onComparatorSelected()');
        this.comparator = comparator;
    }

    public onThresholdSelected() {
        console.log(this.threshold);
    }

    constructor() {
        this.threshold = 50;
        this.comparator = 'lte';
    }

    ngOnChanges() {
        console.log('threshold params ngOnChanges');
        console.log(this);
        console.log(this.threshold);
    }
}
