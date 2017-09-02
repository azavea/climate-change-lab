import { AfterViewInit, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Indicator } from '../../models/indicator.model';
import { HistoricIndicatorQueryParams } from '../../models/historic-indicator-query-params.model';

import * as _ from 'lodash';

/*
 * Historic range params component
 * Form to allow user to specify the historic range base year param
 */
@Component({
  selector: 'ccl-historic-parameters',
  templateUrl: './historic.component.html'
})
export class HistoricComponent implements AfterViewInit, OnInit {

    @Input() indicator: Indicator;
    @Input() extraParams: HistoricIndicatorQueryParams;
    @Output() historicParamSelected = new EventEmitter<HistoricIndicatorQueryParams>();

    historicForm: FormGroup;

    // default form values
    private defaultHistoric = null;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        // must create form on init instead of constructor to capture @Input values
        this.createForm();
    }

    ngAfterViewInit() {
        // Since valueChanges triggers initially before parent is ready, wait until
        // parent is ready here and trigger it to draw chart with extra parameters.
        this.historicParamSelected.emit({
            'historic_range': this.historicForm.controls.historicCtl.value,
        });
    }

    createForm() {
        this.historicForm = this.formBuilder.group({
            historicCtl: [this.extraParams.historic_range || this.defaultHistoric],
        });

        this.historicForm.valueChanges.debounceTime(700).subscribe(form => {
            this.historicParamSelected.emit({
                'historic_range': form.historicCtl,
            });
        });
    }
}
