/*
 * Climate Change Lab
 * App Component
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { Sidebar } from './sidebar/sidebar.component';
import { Charts } from './charts/charts-container.component';
import { ChartService } from './services/chart.service';

import { Ng2AutoCompleteModule } from "./auto-complete";
import { AutoCompleteDirective } from "./auto-complete";
import { AutoCompleteComponent } from "./auto-complete";

@Component({
  selector: 'ccl',
  directives: [Sidebar, Charts, AutoCompleteComponent, AutoCompleteDirective],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './ccl.component.html',
  providers: [ ChartService ]
})

export class ClimateChangeLab {
  name = 'Climate Lab';

  public apiCities: string = "https://staging.api.futurefeelslike.com/api/city/?name=:keyword";
  public cityModel;
}
