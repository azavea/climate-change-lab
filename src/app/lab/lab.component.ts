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

import { ProjectService } from '../services/project.service';

import { Chart } from '../models/chart.model';
import { Indicator } from '../models/indicator.model';
import { Project } from '../models/project.model';


@Component({
  selector: 'ccl-lab',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lab.component.html'
})
export class LabComponent implements OnInit, OnDestroy {

    public project: Project;
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
                        this.indicator = this.project.project_data.charts[0].indicator;
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

    public saveChartSettings() {
        this.projectService.update(this.project).subscribe();
    }

    public removeChart() {
        this.project.project_data.charts = [];
        this.project.project_data.unit = "";
    }

    public indicatorSelected(indicator: Indicator) {
        this.removeChart();
        this.indicator = indicator;
        const chart = new Chart({indicator: indicator});
        this.project.project_data.unit = indicator.default_units;
        this.project.project_data.charts = [chart];
    }
}
