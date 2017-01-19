import { Component, Input } from '@angular/core';

import { ProjectData } from '../../models/project-data.model';

import { apiHost } from '../../constants';

/*  City Dropdown Component

    -- Requires: input project

    Expected use:
        <city-dropdown
        [projectData]="your_project.project_data">
*/

@Component({
  selector: 'city-dropdown',
  template: `<div class="dropdown dropdown-location">
              <div class="input">
                <i *ngIf="showIcon" class="icon-globe"></i>
                <input auto-complete
                    [(ngModel)]="projectData.city"
                    [source]="apiCities"
                    [list-formatter]="cityListFormatter"
                    [value-formatter]="cityValueFormatter"
                    display-property-name="name"
                    path-to-data="features"
                    type="text"
                    placeholder="Enter your city"
                    min-chars="2" />
              </div>
            </div>`
})
export class CityDropdownComponent {

    public apiCities: string = apiHost + '/api/city/?search=:keyword';

    @Input() projectData: ProjectData;
    @Input() showIcon: boolean = true;

    constructor() {}

    // custom formatter to display list of options as City, State
    public cityListFormatter(data: any): string {
        let html: string = '';
        html += data.properties.name ?
            `<span>${data.properties.name}, ${data.properties.admin}</span>`: data;
        return html;
    }

    // custom formatter to display string for selected city as City, State
    public cityValueFormatter(data: any): string {
        let displayValue: string = '';
        if (data && data.properties) {
            displayValue += data.properties.name + ', ' + data.properties.admin;
        }
        return displayValue;
    }
}
