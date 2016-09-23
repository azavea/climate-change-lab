import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';
import { ProjectForm } from './project-form';


@Component({
  selector: 'add-edit-project',
  templateUrl: './add-edit-project.component.html'
})
export class AddEditProjectComponent {

    constructor(private router: Router, private projectService: ProjectService) {}

    model = new ProjectForm(new Project({}));

    onSubmit() {
        this.projectService.add(this.model.project);
        this.onSuccess();
    }

    onSuccess() {
        this.router.navigate(['/lab']);
    }
}
