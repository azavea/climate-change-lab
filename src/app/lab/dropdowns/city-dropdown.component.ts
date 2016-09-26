import { Component, EventEmitter, Input } from '@angular/core';

import { City } from '../../models/city';
import { Project } from '../../models/project';

import { apiHost } from "../../constants";

/*  City Dropdown Component

    -- Requires: input project

    Expected use:
        <city-dropdown
        [project]="your_project">
*/

@Component({
  selector: 'city-dropdown',
  template: `<div class="dropdown dropdown-location">
              <div class="input">
                <i class="icon-globe"></i>
                <input auto-complete
                    [(ngModel)]="project.city"
                    [source]="apiCities"
                    [list-formatter]="cityListFormatter"
                    [value-formatter]="cityValueFormatter"
                    display-property-name="name"
                    path-to-data="features"
                    [value-changed]="onCityClicked()"
                    type="text"
                    placeholder="Enter your city"
                    min-chars="2" />
              </div>
            </div>`
})
export class CityDropdownComponent {

    public apiCities: string = apiHost + "/api/city/?search=:keyword&format=json";

    @Input() project: Project;

    constructor() {}

    public onCityClicked(value: any) {
        return (value) => {
            this.project.city = value;
        };
    }

    // custom formatter to display list of options as City, State
    public cityListFormatter(data: any): string {
        let html: string = "";
        html += data.properties.name ? `<span>${data.properties.name}, ${data.properties.admin}</span>`: data;
        return html;
    }

    // custom formatter to display string for selected city as City, State
    public cityValueFormatter(data: any): string {
        let displayValue: string = "";
        displayValue += data && data.properties ? data.properties.name + ', ' + data.properties.admin : data.toString();
        return displayValue;
    }
}
