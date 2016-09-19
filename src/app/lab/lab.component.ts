/*
 * Climate Change Lab
 * App Component
 */
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChartService } from '../services/chart.service';
import { ClimateModelService } from '../services/climate-model.service';
import { ScenarioService } from '../services/scenario.service';
import { ProjectService } from '../services/project.service';

import { Chart, ChartData } from '../models/chart';
import { Scenario } from '../models/scenario';
import { ClimateModel } from '../models/climate-model';
import { Project, ProjectVisibility } from '../models/project';

import { apiHost, defaultCity, defaultScenario } from "../constants";
import { NavbarComponent } from '../navbar/navbar.component';

import * as _ from 'lodash';


@Component({
  selector: 'cc-lab',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lab.component.html'
})
export class LabComponent implements OnInit, OnDestroy {
  name = 'Climate Lab';

  constructor(viewContainerRef: ViewContainerRef,
              private chartService: ChartService,
              private climateModelService: ClimateModelService,
              private scenarioService: ScenarioService,
              private projectService: ProjectService) {
    // necessary to catch application root view container ref. see:
    // https://valor-software.com/ng2-bootstrap/#/modals
    this.viewContainerRef = viewContainerRef;
  }

  public project: Project;

  public apiCities: string = apiHost + "/api/city/?search=:keyword&format=json";

  private chartData: ChartData[];
  public scenarios: Scenario[];

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
      this.project.city = value;
      this.chartService.updateCity(value);
    };
  }

  // unselect all model checkboxes when option to use all models selected
  public clearClimateModels() {
    _.each(this.project.models, function(model) {
      model.selected = false;
    });
  }

  // deselect option to use all models when one or more model is checked; will also enable the
  // checkbox to use all models (use-all checkbox can only be deselected by selecting a model)
  public deselectUseAllModels() {
    this.project.allModels = false;
  }

  public updateClimateModels() {
    let models = this.getSelectedClimateModels();
    if (!models.length) {
      this.project.allModels = true;
    }
    this.chartService.updateClimateModels(models);
  }

  public updateScenario(scenario: Scenario) {
    this.project.scenario = scenario;
    this.chartService.updateScenario(scenario.name);
  }

  public removeChart(chart: Chart) {
    this.chartService.removeChart(chart);
    this.project.charts = this.chartService.get();
  }

  // subscribe to list of available models from API endpoint
  getAvailableClimateModels() {
    this.climateModelService.list().subscribe(data => {
      this.project.models = data;
    });
  }

  // Returns names of the models currently selected by the user
  getSelectedClimateModels(): string[] {
    return this.project.models.filter(function(model) {
      return model.selected;
    }).map(function(model) {
      return model.name;
    });
  }

  getScenarios() {
    this.scenarioService.list().subscribe(data => this.scenarios = data);
  }

  ngOnInit() {
    // Initialize a project if it doesn't exist, otherwise just use an existing one
    // TODO: This logic should be replaced with actual project handling code
    //       once the feature exists
    let projects = this.projectService.list();
    if (projects.length) {
      this.project = projects[0];
    } else {
      this.project = new Project({
        id: 'test',
        name: 'Test Project',
        description: 'Placeholder for projects feature',
        scenario: {name: defaultScenario, description: ''},
        city: defaultCity
      });
      this.projectService.add(this.project);
    }
    this.chartService.set(this.project.charts);
    console.log('LabComponent.ngOnInit', this.project);

    this.getScenarios();
    if (!this.project.models.length) {
      this.getAvailableClimateModels();
    }

    this.chartService.loadChartData();
    this.chartService.getChartData().subscribe(data=> {
      this.chartData = data;
    });
  }

  ngOnDestroy() {
    console.log('LabComponent.ngOnDestroy', this.project);
    this.projectService.update(this.project);
  }
}
