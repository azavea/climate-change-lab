import { Component, Input } from '@angular/core';

import { Chart } from '../../models/chart.model';

/*  Units Dropdown Component

    -- Requires project input
    Expected use:
        <ccl-units-dropdown
            [chart]="your_chart">
*/

@Component({
  selector: 'ccl-units-dropdown',
  template: `<div dropdown class="dropdown dropdown-units">
              <button dropdownToggle class="button dropdown-toggle" type="button"
                id="unitsDropdown" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="true">
                <i class="icon-flash"></i>
                {{ chart.unit }}
                <i class="icon-angle-down caret"></i>
              </button>
              <ul *dropdownMenu class="dropdown-menu" aria-labelledby="unitsDropdown">
                <li *ngFor="let unit of chart.indicator.available_units">
                  <a (click)="onUnitSelected(unit)"
                    placement="bottom">{{ unit }}</a>
                </li>
              </ul>
            </div>`
})
export class UnitsDropdownComponent {

    @Input() chart: Chart;

    constructor() {}

    public onUnitSelected(unit: string){
        this.chart.unit = unit;
    }
}
