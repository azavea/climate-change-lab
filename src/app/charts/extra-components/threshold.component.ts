import { Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';

import { IndicatorQueryOpts } from '../../models/indicator-query-opts.model';

import * as _ from 'lodash';

/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'ccl-extra-parameters',
  templateUrl: './threshold-parameters.component.html'
})
export class ThresholdComponent implements OnChanges {

    //@Output() onRemoveChart = new EventEmitter<Chart>();

    @Input() threshold: Number;

    constructor() {
        this.threshold = 50;
    }

    ngOnChanges() {
        console.log('threshold params ngOnChanges');
        console.log(this);
        console.log(this.threshold);
    }

    updateExtraParams(extra) {
        console.log(extra);
        console.log('extra');
        console.log(this.threshold);
    }
}
