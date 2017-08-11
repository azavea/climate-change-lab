import { Component, Input, Output, EventEmitter } from '@angular/core';

/*  Units Dropdown Component

    -- Requires handling unit selection
    Expected use:
        <ccl-units-dropdown
            [units]="available_units"
            [unit]="your_unit"
            (unitSelected)="onUnitSelected($event)">
*/

@Component({
  selector: 'ccl-units-dropdown',
  template: `<div dropdown class="dropdown dropdown-units">
              <button dropdownToggle class="button dropdown-toggle" type="button"
                id="unitsDropdown" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="true">
                {{ unit }}
                <i class="caret"></i>
              </button>
              <ul *dropdownMenu class="dropdown-menu" aria-labelledby="unitsDropdown">
                <li *ngFor="let unit of units">
                  <a (click)="onUnitSelected(unit)"
                    placement="bottom">{{ unit }}</a>
                </li>
              </ul>
            </div>`
})

export class UnitsDropdownComponent {

    @Input() units: [string];
    @Input() unit: string;
    @Output() unitSelected = new EventEmitter<string>();

    public onUnitSelected(unit: string) {
        this.unitSelected.emit(unit);
    }
}
