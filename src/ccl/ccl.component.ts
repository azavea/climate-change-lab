/*
 * Climate Change Lab
 * App Component
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { Sidebar } from './sidebar/sidebar.component';
import { Charts } from './charts/charts-container.component';
import { ChartService } from './services/chart.service';

import { AutoCompleteDirective } from "./auto-complete";
import { AutoCompleteComponent } from "./auto-complete";

import { apiHost, defaultCity } from "./constants";

@Component({
  selector: 'ccl',
  directives: [Sidebar, Charts, AutoCompleteComponent, AutoCompleteDirective],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './ccl.component.html',
  providers: [ ChartService ]
})

export class ClimateChangeLab {
  name = 'Climate Lab';

  constructor(private chartService: ChartService) {
    this.cityModel = this.cityValueFormatter(defaultCity);
  }

  public apiCities: string = apiHost + "city/?search=:keyword&format=json";
  public cityModel;

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

  /* Factory that returns a callback invoked when user picks a city.
   * Note that this is invoked rather than passed in the directive, to get the inner function.
   * Using an arrow function to keep the current context, in order to reference the chart service.
   */
  public onCitySelected(value: any) {
    return (value) => {
      this.chartService.updateCity(value);
    };
  }
}
