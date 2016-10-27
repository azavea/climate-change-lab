/*
 * Climate Change Lab
 * App Component
 */
import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProjectService } from '../services/project.service';

import { Chart } from '../models/chart';
import { Indicator } from '../models/indicator.models';
import { Project } from '../models/project';

import * as _ from 'lodash';


@Component({
  selector: 'cc-lab',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lab.component.html'
})
export class LabComponent implements OnInit, OnDestroy {

    private routeParamsSubscription: Subscription;
    public project: Project;

    constructor(private projectService: ProjectService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        // Load existing project id or redirect to dashboard
        this.routeParamsSubscription = this.route.params.subscribe(params => {
            let id: string = params['id'];
            if (id !== undefined) {
              this.project = this.projectService.get(id);
            }
            // Reroute to dashboard if project doesn't exist
            if (!this.project) {
                this.router.navigate(['/']);
            }
        });
    }

    ngOnDestroy() {
        this.routeParamsSubscription.unsubscribe();
        if (this.project) {
            this.projectService.update(this.project);
        }
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
        this.project.charts.unshift(chart);
        this.projectService.update(this.project);
    }
}
