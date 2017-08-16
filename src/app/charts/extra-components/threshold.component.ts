import { Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

    thresholdForm: FormGroup;

    createForm() {
        this.thresholdForm = this.fb.group({
            comparatorCtl: ['lte', Validators.required],
            thresholdCtl: [50, Validators.required],
            thresholdUnitCtl: ['F', Validators.required]
        });

        this.thresholdForm.valueChanges.subscribe(form => {
            console.log('form changed!');
            console.log(form);
            if (_.isUndefined(form.comparatorCtl) ||
                _.isUndefined(form.thresholdCtl) ||
                _.isUndefined(form.thresholdUnitCtl)) {

                    console.log('missing something; do not tell parent');
                    return;
            }

            console.log('go tell parent');
            this.thresholdParamSelected.emit({
                'event': event,
                'threshold_comparator': form.comparatorCtl,
                'threshold': form.thresholdCtl,
                'threshold_units': form.thresholdUnitCtl
            });
        });
    }

    @Input() comparators: any[] = [
        {'key': 'gte', 'label': 'greater than or equal to'},
        {'key': 'lte', 'label': 'less than or equal to'},
        {'key': 'ge', 'label': 'greater than'},
        {'key': 'le', 'label': 'less than'}
    ];
    @Input() thresholdUnits: any[] = [
        {'key': 'K', 'label': 'Kelvin'},
        {'key': 'F', 'label': 'Farenheit'},
        {'key': 'C', 'label': 'Centigrade'}
     ];

    @Output() thresholdParamSelected = new EventEmitter<any>();

    constructor(private fb: FormBuilder) {
        this.createForm();
    }

    ngOnChanges() {
        console.log('threshold params ngOnChanges');
        console.log(this);

        //this.notifyChanges();
    }
}
