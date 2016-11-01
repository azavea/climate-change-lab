/*
 * Climate Change Lab
 * App Component
 */
import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProjectService } from '../services/project.service';

import { Chart } from '../models/chart.model';
import { Indicator } from '../models/indicator.model';
import { Project } from '../models/project.model';

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

    // Save
    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event) {
        this.saveChartSettings();
    }

    ngOnInit() {
        // Load existing project id or redirect to dashboard
        this.routeParamsSubscription = this.route.params.subscribe(params => {
            let id: string = params['id'];
            if (id !== undefined) {
                this.projectService.get(id).subscribe(
                    data => this.project = data,
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

    public saveChartSettings() {
        this.projectService.update(this.project).subscribe();
    }

    public removeChart(chart: Chart) {
        this.project.project_data.charts = this.project.project_data.charts.filter(c => c !== chart);
    }

    public indicatorSelected(indicator: Indicator) {
        let chart = new Chart({indicator: indicator});
        this.project.project_data.charts.unshift(chart);
    }
}
