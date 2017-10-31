/*
 * Climate Change Lab
 * App Component
 */
import { Component,
         OnInit,
         OnDestroy,
         ViewEncapsulation,
         HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import {
    Chart,
    ClimateModel,
    Dataset,
    Indicator,
    IndicatorQueryParams,
    Scenario
} from 'climate-change-components';

import { ProjectService } from '../services/project.service';

import { Project } from '../models/project.model';


@Component({
  selector: 'ccl-lab',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lab.component.html'
})
export class LabComponent implements OnInit, OnDestroy {

    public project: Project;
    public chart: Chart;
    public indicator: Indicator;
    private routeParamsSubscription: Subscription;

    constructor(private projectService: ProjectService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    // Save
    @HostListener('window:beforeunload', ['$event'])
    unloadHandler() {
        this.saveChartSettings();
    }

    ngOnInit() {
        // Load existing project id or redirect to dashboard
        this.routeParamsSubscription = this.route.params.subscribe(params => {
            const id: string = params['id'];
            if (id !== undefined) {
                this.projectService.get(id).subscribe(
                    data => {
                        this.project = data;
                        if (this.project.project_data.charts[0]) {
                            this.indicator = this.project.project_data.charts[0].indicator;
                        }
                    },
                    error => this.router.navigate(['/']) // Reroute if error
                );
            } else {
                // Reroute to dashboard if project doesn't exist
                this.router.navigate(['/']);
            }
        });
    }

    ngOnDestroy() {
        this.routeParamsSubscription.unsubscribe();
        if (this.project) {
            this.saveChartSettings();
        }
    }

    onUnitSelected(unit) {
        this.project.project_data.charts[0].unit = unit;
    }

    public saveChartSettings() {
        this.projectService.update(this.project).subscribe();
    }

    public removeChart() {
        this.project.project_data.charts = [];
        this.indicator = null;
    }

    public saveExtraParams(params: IndicatorQueryParams) {
        this.project.project_data.extraParams = params;
    }

    public datasetSelected(dataset: Dataset) {
        this.project.project_data.dataset = dataset;
    }

    public indicatorSelected(indicator: Indicator) {
        // Must compare indicator names and not objects,
        // or else will fail for first loaded indicator on page.
        if (this.indicator && this.indicator.name === indicator.name) {
            // do nothing if selected indicator is current indicator
            return;
        }
        this.removeChart();
        /*  Trigger lifecycle to truly destroy the chart component & its children
            Reset defaults in fresh child components
            Cleanly evaluate which children to have (e.g. extra params) */
        setTimeout(() => {
            this.indicator = indicator;
            this.saveExtraParams({});
            const chart = new Chart({indicator: indicator,
                                     unit: indicator.default_units});
            this.project.project_data.charts = [chart];
        })
    }

    public modelsChanged(models: ClimateModel[]) {
        this.project.project_data.models = models;
    }

    public scenarioSelected(scenario: Scenario) {
        this.project.project_data.scenario = scenario;
    }
}
