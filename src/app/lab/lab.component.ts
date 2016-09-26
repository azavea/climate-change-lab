/*
 * Climate Change Lab
 * App Component
 */
import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute }     from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { ScenarioDropdownComponent } from './dropdowns/scenario-dropdown.component';
import { ModelDropdownComponent } from './dropdowns/model-dropdown.component';
import { ChartService } from '../services/chart.service';
import { ProjectService } from '../services/project.service';

import { Chart } from '../models/chart';
import { Scenario } from '../models/scenario';
import { Indicator } from '../models/indicator.models';
import { Project } from '../models/project';

import { apiHost, defaultCity, defaultScenario } from "../constants";

import * as _ from 'lodash';


@Component({
  selector: 'cc-lab',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lab.component.html'
})
export class LabComponent implements OnInit, OnDestroy {

  public apiCities: string = apiHost + "/api/city/?search=:keyword";
  public project: Project;

  constructor(private chartService: ChartService,
              private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    // Load existing project id or redirect to dashboard
    let id = this.route.params.subscribe(params => id = params['id']);
    if (id !== undefined) {
      this.project = this.projectService.get(id);
    } else {
      this.router.navigate(['']);
    }
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

  public removeChart(chart: Chart) {
    this.project.charts = this.project.charts.filter(c => c !== chart);
    this.projectService.update(this.project);
  }

  public indicatorSelected(indicator: Indicator) {
    let chart = new Chart({indicator: indicator});
    this.project.charts.push(chart);
    this.projectService.update(this.project);
  }
}
