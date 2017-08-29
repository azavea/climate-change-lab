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

    private thresholdTemperatureUnits: any[] = [
        {'key': 'K', 'label': 'Kelvin'},
        {'key': 'F', 'label': 'Farenheit'},
        {'key': 'C', 'label': 'Centigrade'}
     ];

     private thresholdComparators: any[] = [
        {'key': 'gte', 'label': 'greater than or equal to'},
        {'key': 'lte', 'label': 'less than or equal to'},
        {'key': 'gt', 'label': 'greater than'},
        {'key': 'lt', 'label': 'less than'}
    ];

    private thresholdPrecipitationUnits: any[] = [
        {'key': 'mm', 'label': 'millimeters'},
        {'key': 'in', 'label': 'inches'},
        {'key': 'kg/m^2', 'label': 'kg/m^2'}
    ];

    // default form values
    private defaultThreshold = 50;
    private defaultPrecipitationUnit = 'mm';
    private defaultTemperatureUnit = 'F';
    private defaultComparator = 'lte';

    @Input() comparators: any[] = this.thresholdComparators;

    @Input() thresholdUnits: any[] = this.thresholdTemperatureUnits;

    @Output() thresholdParamSelected = new EventEmitter<any>();

    createForm() {
        this.thresholdForm = this.fb.group({
            comparatorCtl: [this.defaultComparator, Validators.required],
            thresholdCtl: [this.defaultThreshold, Validators.required],
            thresholdUnitCtl: [this.defaultTemperatureUnit, Validators.required]
        });

        this.thresholdForm.valueChanges.debounceTime(1000).subscribe(form => {
            this.thresholdParamSelected.emit({data: {
                'event': event,
                'threshold_comparator': form.comparatorCtl,
                'threshold': form.thresholdCtl,
                'threshold_units': form.thresholdUnitCtl
            }});
        });
    }

    constructor(private fb: FormBuilder) {
        this.createForm();
    }

    ngAfterViewInit() {
        // Since valueChanges triggers initially before parent is ready, wait until
        // parent is ready here and trigger it to draw chart with extra parameters.
        this.thresholdParamSelected.emit({data: {
            'threshold_comparator': this.thresholdForm.controls.comparatorCtl.value,
            'threshold': this.thresholdForm.controls.thresholdCtl.value,
            'threshold_units': this.thresholdForm.controls.thresholdUnitCtl.value
        }});
    }

    ngOnChanges(changes: any) {
        // listen for the indicator label to be set before changing options and defaults, if needed

        if (this.label.indexOf('Precipitation') > -1) {
            this.thresholdUnits = this.thresholdPrecipitationUnits;
            this.thresholdForm.reset({
                thresholdUnitCtl: this.defaultPrecipitationUnit,
                comparatorCtl: this.defaultComparator,
                thresholdCtl: this.defaultThreshold
            });
        } else {
            this.thresholdUnits = this.thresholdTemperatureUnits;
            this.thresholdForm.reset({
                thresholdUnitCtl: this.defaultTemperatureUnit,
                comparatorCtl: this.defaultComparator,
                thresholdCtl: this.defaultThreshold
            });
        }
    }
}
