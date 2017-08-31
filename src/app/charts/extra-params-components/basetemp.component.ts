import { AfterViewInit, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Indicator } from '../../models/indicator.model';

import * as _ from 'lodash';

/*
 * Basetemp params component
 * Multi-field form to allow user to specify the basetemp params
 */
@Component({
  selector: 'ccl-basetemp-parameters',
  templateUrl: './basetemp.component.html'
})
export class BasetempComponent implements AfterViewInit, OnInit {

    @Input() indicator: Indicator;
    @Input() extraParams: any;

    basetempForm: FormGroup;

    // default form values
    private defaultBasetemp = 50;
    private defaultBasetempUnit = 'F';

    @Output() basetempParamSelected = new EventEmitter<any>();

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        // must create form on init instead of constructor to capture @Input values
        this.createForm();
    }

    ngAfterViewInit() {
        // Since valueChanges triggers initially before parent is ready, wait until
        // parent is ready here and trigger it to draw chart with extra parameters.
        this.basetempParamSelected.emit({data: {
            'basetemp': this.basetempForm.controls.basetempCtl.value,
            'basetemp_units': this.basetempForm.controls.basetempUnitCtl.value
        }});
    }

    createForm() {
        this.basetempForm = this.formBuilder.group({
            basetempCtl: [this.extraParams.basetemp || this.defaultBasetemp, Validators.required],
            basetempUnitCtl: [this.extraParams.basetemp_units || this.defaultBasetempUnit, Validators.required]
        });

        this.basetempForm.valueChanges.debounceTime(700).subscribe(form => {
            this.basetempParamSelected.emit({data: {
                'event': event,
                'basetemp': form.basetempCtl,
                'basetemp_units': form.basetempUnitCtl
            }});
        });
    }
}