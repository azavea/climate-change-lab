import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Project } from '../models/project.model';
import { ProjectData } from '../models/project-data.model';
import { Scenario } from '../models/scenario.model';
import { City } from '../models/city.model';
import { ProjectService } from '../services/project.service';
import { ProjectForm } from './project-form';
import {
    CityDropdownComponent,
    ModelModalComponent,
    ScenarioToggleComponent,
    UnitsDropdownComponent } from '../lab';

/* Add/Edit Project Component
*/

@Component({
  selector: 'ccl-add-edit-project',
  templateUrl: './add-edit-project.component.html'
})
export class AddEditProjectComponent implements OnInit {

    public project: Project;
    public edit = false;
    public model = {'project': {} as Project};
    private routeParamsSubscription: Subscription;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private projectService: ProjectService) {}

    ngOnInit() {
        // Load current project
        this.routeParamsSubscription = this.route.params.subscribe(params => {
            const id: string = params['id'];
            if (id !== undefined) {
                this.projectService.get(id).subscribe(data => {
                    this.model.project = data;
                    // Reroute to dashboard if project doesn't exist
                    if (!this.model.project) {
                        this.router.navigate(['/']);
                    }
                    this.edit = true;
                });
            }
        });
        // Else, create new project
        if (!this.edit) {
            this.model = new ProjectForm(new Project({}));
            // Dropdowns & autocompletes require a value, {} at the very least
            this.model.project.project_data.scenario = {} as Scenario;
            this.model.project.project_data.city = {} as City;
        }
    }

    onSubmit() {
        this.routeParamsSubscription.unsubscribe();
        if (this.edit) {
            this.projectService.update(this.model.project).subscribe(data => {
                this.model.project = data;
                this.onSuccess();
            });
        } else {
            this.projectService.add(this.model.project).subscribe(data => {
                this.model.project = data;
                this.onSuccess();
            });
        }
    }

    onUnitSelected(unit){
        this.model.project.project_data.charts[0].unit = unit;
    }

    onSuccess() {
        this.router.navigate(['/lab', this.model.project.id]);
    }
}
