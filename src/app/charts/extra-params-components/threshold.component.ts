import { AfterViewInit, Component, EventEmitter, OnChanges, Input, Output, OnInit } from '@angular/core';
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
export class ThresholdComponent implements AfterViewInit, OnChanges, OnInit {

    @Input() label: string;
    @Input() extraParams: any;

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
    private defaultUnit = '';
    private defaultPrecipitationUnit = 'mm';
    private defaultTemperatureUnit = 'F';
    private defaultComparator = 'lte';

    @Input() comparators: any[] = this.thresholdComparators;

    @Input() thresholdUnits: any[] = this.thresholdTemperatureUnits;

    @Output() thresholdParamSelected = new EventEmitter<any>();

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes: any) {
        /* Ignore change detection:
            - before initalization
            - from extraParams @Input whose initial values are all we want
        */
        if (changes.label && this.thresholdForm) {
            this.thresholdForm.reset({
                thresholdUnitCtl: this.defaultUnit,
                comparatorCtl: this.defaultComparator,
                thresholdCtl: this.defaultThreshold
            });
        }
    }

    ngOnInit() {
        this.createForm(); // must create form on init instead of constructor to capture @Input values
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

    createForm() {
        this.evaluateVariable();
        this.thresholdForm = this.fb.group({
            comparatorCtl: [this.extraParams.threshold_comparator || this.defaultComparator, Validators.required],
            thresholdCtl: [this.extraParams.threshold || this.defaultThreshold, Validators.required],
            thresholdUnitCtl: [this.extraParams.threshold_units || this.defaultUnit, Validators.required]
        });

        this.thresholdForm.valueChanges.debounceTime(700).subscribe(form => {
            this.thresholdParamSelected.emit({data: {
                'event': event,
                'threshold_comparator': form.comparatorCtl,
                'threshold': form.thresholdCtl,
                'threshold_units': form.thresholdUnitCtl
            }});
        });
    }

    private evaluateVariable() {
        // Set component to precip or temperature
        if (this.label.indexOf('Precipitation') > -1) {
            this.defaultUnit = this.defaultPrecipitationUnit;
            this.thresholdUnits = this.thresholdPrecipitationUnits;
        } else {
            this.defaultUnit = this.defaultTemperatureUnit;
            this.thresholdUnits = this.thresholdTemperatureUnits;
        }
    }
}
