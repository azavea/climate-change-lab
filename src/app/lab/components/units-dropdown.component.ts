import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Chart } from '../../models/chart.model';
import { Indicator } from '../../models/indicator.model';

/*  Units Dropdown Component

    -- Requires handling unit selection
    Expected use:
        <ccl-units-dropdown
            [indicator]="your_indicator"
            [unit]="your_unit"
            (unitSelected)="onUnitSelected($event)">
*/

@Component({
  selector: 'ccl-units-dropdown',
  template: `<div dropdown class="dropdown dropdown-units">
              <button dropdownToggle class="button dropdown-toggle" type="button"
                id="unitsDropdown" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="true">
                <i class="icon-flash"></i>
                {{ unit || indicator.default_units }}
                <i class="icon-angle-down caret"></i>
              </button>
              <ul *dropdownMenu class="dropdown-menu" aria-labelledby="unitsDropdown">
                <li *ngFor="let unit of indicator.available_units">
                  <a (click)="onUnitSelected(unit)"
                    placement="bottom">{{ unit }}</a>
                </li>
              </ul>
            </div>`
})

export class UnitsDropdownComponent {

    @Input() indicator: Indicator;
    @Input() unit: string;
    @Output() unitSelected = new EventEmitter<string>();

    public onUnitSelected(unit: string) {
        this.unitSelected.emit(unit);
    }
}
