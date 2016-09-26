/*
 * Climate Change Lab
 * App Component
 */
import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute }     from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { ScenarioDropdownComponent } from './dropdowns/scenario-dropdown.component';
import { ModelDropdownComponent } from './dropdowns/model-dropdown.component';
import { CityDropdownComponent } from './dropdowns/city-dropdown.component';
import { ChartService } from '../services/chart.service';
import { ProjectService } from '../services/project.service';

import { Chart } from '../models/chart';
import { City } from '../models/city';
import { Scenario } from '../models/scenario';
import { Indicator } from '../models/indicator.models';
import { Project } from '../models/project';

import { defaultCity, defaultScenario } from "../constants";

import * as _ from 'lodash';


@Component({
  selector: 'cc-lab',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lab.component.html'
})
export class LabComponent implements OnInit, OnDestroy {

  public project: Project;

  constructor(private chartService: ChartService,
              private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    // Load existing project id or redirect to dashboard
    this.route.params.subscribe(params => {
      let id: string = params['id'];
      if (id !== undefined) {
        this.project = this.projectService.get(id);
      } else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnDestroy() {
    this.projectService.update(this.project);
  }

  /* Factory that returns a callback invoked when user picks a city.
   * Note that this is invoked rather than passed in the directive, to get the inner function.
   * Using an arrow function to keep the current context, in order to reference the chart service.
   */
  public updateCity(city: City) {
    this.project.city = city;
    this.projectService.update(this.project);
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
