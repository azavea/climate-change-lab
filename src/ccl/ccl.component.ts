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

import {apiHost} from "./constants";

@Component({
  selector: 'ccl',
  directives: [Sidebar, Charts, AutoCompleteComponent, AutoCompleteDirective],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './ccl.component.html',
  providers: [ ChartService ]
})

export class ClimateChangeLab {
  name = 'Climate Lab';

  public apiCities: string = apiHost + "city/?search=:keyword";
  public cityModel;

  // custom formatter to display list of options as City, State
  public cityListFormatter(data: any): string {
    let html: string = "";
    html += data.properties.name ? `<span>${data.properties.name}, ${data.properties.admin}</span>`: data;
    return html;
  }
}
