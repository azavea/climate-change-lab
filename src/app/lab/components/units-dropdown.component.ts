import { Component, OnInit, Input } from '@angular/core';

import { Indicator } from '../../models/indicator.model';
import { ProjectData } from '../../models/project-data.model';

/*  Units Dropdown Component

    -- Requires project input
    Expected use:
        <ccl-units-dropdown
            [projectData]="your_project.project_data"
            [units]="avail_units">
*/

@Component({
  selector: 'ccl-units-dropdown',
  template: `<div dropdown class="dropdown dropdown-units">
              <button dropdownToggle class="button dropdown-toggle" type="button"
                id="unitsDropdown" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="true">
                <i class="icon-flash"></i>
                {{ projectData.unit }}
                <i class="icon-angle-down caret"></i>
              </button>
              <ul *dropdownMenu class="dropdown-menu" aria-labelledby="unitsDropdown">
                <li *ngFor="let unit of units">
                  <a (click)="onUnitSelected(unit)"
                    placement="bottom">{{ unit }}</a>
                </li>
              </ul>
            </div>`
})
export class UnitsDropdownComponent implements OnInit {

    @Input() projectData: ProjectData;
    @Input() units: [string];
    public indicator: Indicator;

    constructor() {}

    ngOnInit() {
        this.indicator = this.projectData.charts[0].indicator;
        this.projectData.unit = this.indicator.default_units;
    }

    public onUnitSelected(unit: string){
        this.projectData.unit = unit;
    }
}
