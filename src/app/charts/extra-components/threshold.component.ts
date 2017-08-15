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
    @Input() comparators: any[] = [
        {'key': 'gte', 'label': 'greater than or equal to'},
        {'key': 'lte', 'label': 'less than or equal to'},
        {'key': 'ge', 'label': 'greater than'},
        {'key': 'le', 'label': 'less than'}
    ]    ;
    @Input() thresholdUnits: string[] = ['K', 'F', 'C'];
    @Input() thresholdUnit: string;
    @Output() thresholdParamSelected = new EventEmitter();

    public onUnitSelected(unit: string) {
        console.log('child onUnitSelected');
        this.thresholdUnit = unit;
        console.log(unit);
        this.notifyChanges();
    }

    public onComparatorSelected(comparator: string) {
        console.log(comparator);
        this.comparator = comparator;
        this.notifyChanges();
    }

    public onThresholdSelected() {
        console.log(this.threshold);
        this.notifyChanges();
    }

    public labelForComparator(comp) {
        let found = _.find(this.comparators, function(c) {
            return c.key === comp;
        });
        if (found) {
            return found.label;
        } else {
            return '';
        }
    }

    notifyChanges() {
        console.log('notifyChanges');
        /*
        if (!this.thresholdUnit || !this.threshold || !this.comparator) {
            console.log('missing something, do not notify');
            return;
        }
        */
        this.thresholdParamSelected.emit();
    }

    constructor() {
        this.threshold = 50;
        this.comparator = 'lte';
        this.thresholdUnit = 'F';
    }

    ngOnChanges() {
        console.log('threshold params ngOnChanges');
        console.log(this);
        console.log(this.threshold);
    }
}
