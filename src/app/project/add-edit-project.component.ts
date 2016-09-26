import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Project } from '../models/project';
import { Scenario } from '../models/scenario';
import { City } from '../models/city';
import { ProjectService } from '../services/project.service';
import { ProjectForm } from './project-form';
import { CityDropdownComponent } from '../lab/dropdowns/city-dropdown.component';
import { ScenarioDropdownComponent } from '../lab/dropdowns/scenario-dropdown.component';
import { ModelDropdownComponent } from '../lab/dropdowns/model-dropdown.component';


@Component({
  selector: 'add-edit-project',
  templateUrl: './add-edit-project.component.html'
})
export class AddEditProjectComponent implements OnInit {

    @Input() project: Project;
    public edit: boolean;
    public model;

    constructor(private router: Router, private projectService: ProjectService) {
        this.edit = this.project? true: false;
    }

    ngOnInit() {
        if (this.edit) {
            this.model.project = this.project;
        } else {
            this.model = new ProjectForm(new Project({}));
        }
    }

    onSubmit() {
        if (this.edit) {
            this.projectService.update(this.model.project);
        } else {
            this.projectService.add(this.model.project);
            this.onSuccess();
        }
    }

    onSuccess() {
        this.router.navigate(['/lab', this.model.project.id]);
    }
}
