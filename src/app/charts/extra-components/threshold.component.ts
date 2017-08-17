import { AfterViewInit, Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';

/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'ccl-threshold-parameters',
  templateUrl: './threshold.component.html'
})
export class ThresholdComponent implements AfterViewInit, OnChanges {

    @Input() label: string;

    thresholdForm: FormGroup;

    @Input() comparators: any[] = [
        {'key': 'gte', 'label': 'greater than or equal to'},
        {'key': 'lte', 'label': 'less than or equal to'},
        {'key': 'gt', 'label': 'greater than'},
        {'key': 'lt', 'label': 'less than'}
    ];
    @Input() thresholdUnits: any[] = [
        {'key': 'K', 'label': 'Kelvin'},
        {'key': 'F', 'label': 'Farenheit'},
        {'key': 'C', 'label': 'Centigrade'}
     ];

    @Output() thresholdParamSelected = new EventEmitter<any>();

    createForm() {
        this.thresholdForm = this.fb.group({
            comparatorCtl: ['lte', Validators.required],
            thresholdCtl: [50, Validators.required],
            thresholdUnitCtl: ['F', Validators.required]
        });

        this.thresholdForm.valueChanges.debounceTime(1000).subscribe(form => {
            this.thresholdParamSelected.emit({
                'event': event,
                'threshold_comparator': form.comparatorCtl,
                'threshold': form.thresholdCtl,
                'threshold_units': form.thresholdUnitCtl
            });
        });
    }

    constructor(private fb: FormBuilder) {
        this.createForm();
    }

    ngAfterViewInit() {
        // Since valueChanges triggers initially before parent is ready, wait until
        // parent is ready here and trigger it to draw chart with extra parameters.
        this.thresholdParamSelected.emit({
            'event': null,
            'threshold_comparator': this.thresholdForm.controls.comparatorCtl.value,
            'threshold': this.thresholdForm.controls.thresholdCtl.value,
            'threshold_units': this.thresholdForm.controls.thresholdUnitCtl.value
        });
    }

    ngOnChanges(changes: any) {
        // listen for the indicator label to be set before changing options and defaults, if needed
        if (this.label.indexOf('Precipitation') > -1) {
            this.thresholdUnits = [
                {'key': 'mm', 'label': 'millimeters'},
                {'key': 'in', 'label': 'inches'},
                {'key': 'kg/m^2', 'label': 'kg/m^2'}
            ];
            this.thresholdForm.controls.thresholdUnitCtl.setValue('mm');
        }
    }
}
