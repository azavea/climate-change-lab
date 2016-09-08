/*
 * Climate Change Lab
 * App Component
 */
import { Component, OnInit, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChartsContainerComponent } from '../charts/charts-container.component';
import { ClimateModel, Scenario } from '../models/chart.models';
import { ChartService } from '../services/chart.service';

import { AutoCompleteDirective } from "../auto-complete";
import { AutoCompleteComponent } from "../auto-complete";

import { DROPDOWN_DIRECTIVES, MODAL_DIRECTIVES, BS_VIEW_PROVIDERS, TOOLTIP_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { apiHost, defaultCity, defaultScenario } from "../constants";
import { NavbarComponent } from '../navbar/navbar.component';

import * as _ from 'lodash';


@Component({
  selector: 'cc-lab',
  directives: [DROPDOWN_DIRECTIVES, MODAL_DIRECTIVES, TOOLTIP_DIRECTIVES,
               NavbarComponent, SidebarComponent, ChartsContainerComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lab.component.html',
  viewProviders: [BS_VIEW_PROVIDERS]
})
export class LabComponent extends OnInit {
  name = 'Climate Lab';

  constructor(viewContainerRef: ViewContainerRef, private chartService: ChartService) {
    super();

    // necessary to catch application root view container ref. see:
    // https://valor-software.com/ng2-bootstrap/#/modals
    this.viewContainerRef = viewContainerRef;
  }

  public apiCities: string = apiHost + "/api/city/?search=:keyword&format=json";
  public cityModel;
  public climateModels: ClimateModel[];
  public allModels: boolean;

  public scenarios: Scenario[];
  public selectedScenario: string;

  public viewContainerRef: ViewContainerRef;

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

  // unselect all model checkboxes when option to use all models selected
  public clearClimateModels() {
    _.each(this.climateModels, function(model) {
      model.selected = false;
    });
  }

  // deselect option to use all models when one or more model is checked; will also enable the
  // checkbox to use all models (use-all checkbox can only be deselected by selecting a model)
  public deselectUseAllModels() {
    this.allModels = false;
  }

  public updateClimateModels() {
    let models = this.getSelectedClimateModels();
    if (!models.length) {
      this.allModels = true;
    }
    this.chartService.updateClimateModels(models);
  }

  public updateScenario(scenario: Scenario) {
    this.selectedScenario = scenario.name;
    this.chartService.updateScenario(scenario.name);
  }

  // subscribe to list of available models from API endpoint
  getAvailableClimateModels() {
    this.chartService.loadClimateModels();
    this.chartService.getClimateModels().subscribe(data => {
      this.climateModels = data;
    });
  }

  // Returns names of the models currently selected by the user
  getSelectedClimateModels(): string[] {
    return this.climateModels.filter(function(model) {
      return model.selected;
    }).map(function(model) {
      return model.name;
    });
  }

  getScenarios() {
    this.chartService.loadScenarios();
    this.chartService.getScenarios().subscribe(data => this.scenarios = data);
  }

  ngOnInit() {
    this.cityModel = this.cityValueFormatter(defaultCity);
    this.selectedScenario = defaultScenario;
    this.allModels = true;

    this.getScenarios();
    this.getAvailableClimateModels();
  }
}
