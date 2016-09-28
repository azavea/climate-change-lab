import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Project } from '../models/project';
import { Scenario } from '../models/scenario';
import { City } from '../models/city';
import { ProjectService } from '../services/project.service';
import { ProjectForm } from './project-form';
import { CityDropdownComponent } from '../lab/dropdowns/city-dropdown.component';
import { ScenarioDropdownComponent } from '../lab/dropdowns/scenario-dropdown.component';
import { ModelModalComponent } from '../lab/dropdowns/model-modal.component';


/* Add/Edit Project Component
*/

@Component({
  selector: 'add-edit-project',
  templateUrl: './add-edit-project.component.html'
})
export class AddEditProjectComponent implements OnInit {

    public project: Project;
    public edit: boolean = false;
    public model = {'project': {} as Project};

    constructor(private router: Router,
                private route: ActivatedRoute,
                private projectService: ProjectService) {}

    ngOnInit() {
        // Load current project
        this.route.params.subscribe(params => {
            let id: string = params['id'];
            if (id !== undefined) {
                this.model.project = this.projectService.get(id);
                this.edit = true;
            }
        });
        // Else, create new project
        if (!this.edit) {
            this.model = new ProjectForm(new Project({}));
        }
    }

    onSubmit() {
        if (this.edit) {
            this.projectService.update(this.model.project);
        } else {
            this.projectService.add(this.model.project);
        }
        this.onSuccess();
    }

    onSuccess() {
        this.router.navigate(['/lab', this.model.project.id]);
    }
}
