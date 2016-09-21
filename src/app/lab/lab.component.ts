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
import { Indicator } from '../models/indicator.models';
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

  public apiCities: string = apiHost + "/api/city/?search=:keyword&format=json";
  public climateModels: ClimateModel[] = [];
  public scenarios: Scenario[] = [];
  public project: Project;
  public viewContainerRef: ViewContainerRef;

  constructor(viewContainerRef: ViewContainerRef,
              private chartService: ChartService,
              private climateModelService: ClimateModelService,
              private scenarioService: ScenarioService,
              private projectService: ProjectService) {
    // necessary to catch application root view container ref. see:
    // https://valor-software.com/ng2-bootstrap/#/modals
    this.viewContainerRef = viewContainerRef;
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

    this.getClimateModels();
    this.getScenarios();
  }

  ngOnDestroy() {
    this.projectService.update(this.project);
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

  /* Factory that returns a callback invoked when user picks a city.
   * Note that this is invoked rather than passed in the directive, to get the inner function.
   * Using an arrow function to keep the current context, in order to reference the chart service.
   */
  public onCitySelected(value: any) {
    return (value) => {
      this.project.city = value;
      this.projectService.update(this.project);
    };
  }

  public chartSettingChanged() {
    this.projectService.update(this.project);
  }

  // unselect all model checkboxes when option to use all models selected
  public clearClimateModels() {
    this.climateModels.forEach(model => model.selected = false);
  }

  public selectAllClimateModels() {
    this.climateModels.forEach(model => model.selected = true);
  }

  public updateProjectClimateModels() {
    this.project.models = this.climateModels.filter(model => model.selected);
    this.projectService.update(this.project);
  }

  public updateScenario(scenario: Scenario) {
    this.project.scenario = scenario;
    this.projectService.update(this.project);
  }

  public removeChart(chart: Chart) {
    this.project.charts = this.project.charts.filter(c => c !== chart);
    this.projectService.update(this.project);
  }

  public indicatorSelected(indicator: Indicator) {
    let chart = new Chart({indicator: indicator});
    this.project.charts.push(chart);
    this.projectService.update(this.project);
  }

  // subscribe to list of available models from API endpoint
  private getClimateModels() {
    this.climateModelService.list().subscribe(data => {
      this.climateModels = data;

      // Initialize 'selected' attributes with models in project
      if (this.project.models.length === 0) {
        this.selectAllClimateModels();
        this.updateProjectClimateModels();
      } else {
        this.project.models.forEach(projectModel => {
          this.climateModels.forEach(model => {
            if (projectModel.name === model.name) {
              model.selected = projectModel.selected;
            }
          })
        })
      }
    });
  }

  private getScenarios() {
    this.scenarioService.list().subscribe(data => this.scenarios = data);
  }

}
