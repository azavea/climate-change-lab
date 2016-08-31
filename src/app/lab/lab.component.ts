/*
 * Climate Change Lab
 * App Component
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChartsContainerComponent } from '../charts/charts-container.component';
import { ClimateModel, Scenario } from '../models/chart.models';
import { ChartService } from '../services/chart.service';

import { AutoCompleteDirective } from "../auto-complete";
import { AutoCompleteComponent } from "../auto-complete";

import { apiHost, defaultCity, defaultScenario } from "../constants";
import { NavbarComponent } from '../navbar/navbar.component';

import * as _ from 'lodash';


@Component({
  selector: 'cc-lab',
  directives: [NavbarComponent, SidebarComponent, ChartsContainerComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lab.component.html'
})
export class LabComponent extends OnInit {
  name = 'Climate Lab';

  constructor(private chartService: ChartService) {
    super();
  }

  public apiCities: string = apiHost + "city/?search=:keyword&format=json";
  public cityModel;
  public climateModels: ClimateModel[];

  public scenarios: Scenario[];
  public selectedScenario: string;

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

  public updateClimateModels() {
    let models: string[] = this.climateModels.filter(function(model) {
      return model.selected;
    }).map(function(model) {
      return model.name;
    });

    this.chartService.updateClimateModels(models);
  }

  public updateScenario(scenario: Scenario) {
    this.selectedScenario = scenario.name;
    this.chartService.updateScenario(scenario.name);
  }

  getClimateModels() {
    this.chartService.loadClimateModels();
    this.chartService.getClimateModels().subscribe(data => {
      this.climateModels = data;
    });
  }

  getScenarios() {
    this.chartService.loadScenarios();
    this.chartService.getScenarios().subscribe(data => {
      // TODO: it would be nice to populate a tooltip for the scenario list items with their
      // descriptions once angular2-bootstrap is in place
      this.scenarios = data;
    });
  }

  ngOnInit() {
    this.cityModel = this.cityValueFormatter(defaultCity);
    this.selectedScenario = defaultScenario;
    this.getScenarios();
    this.getClimateModels();
  }
}
