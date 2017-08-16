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
            this.thresholdParamSelected.emit();
        });
    }

    //@Output() onRemoveChart = new EventEmitter<Chart>();

    @Input() threshold: Number;
    @Input() comparator: string;
    @Input() comparators: any[] = [
        {'key': 'gte', 'label': 'greater than or equal to'},
        {'key': 'lte', 'label': 'less than or equal to'},
        {'key': 'ge', 'label': 'greater than'},
        {'key': 'le', 'label': 'less than'}
    ];
    @Input() thresholdUnits: any[] = [
        {'key': 'K', 'label': 'Kelvin'},
        {'key': 'F', 'label': 'Farenheit'},
        {'key': 'C', 'label': 'Celsius'}
     ];
    @Input() thresholdUnit: string;
    @Output() thresholdParamSelected = new EventEmitter();

    notifyChanges() {
        console.log('notifyChanges');
        /*
        if (!this.thresholdUnit || !this.threshold || !this.comparator) {
            console.log('missing something, do not notify');
            return;
        }
        */
        
    }

    constructor(private fb: FormBuilder) {
        this.createForm();

        this.threshold = 50;
        this.comparator = 'lte';
        this.thresholdUnit = 'F';
    }

    ngOnChanges() {
        console.log('threshold params ngOnChanges');
        console.log(this);
        console.log(this.threshold);

        //this.notifyChanges();
    }
}
