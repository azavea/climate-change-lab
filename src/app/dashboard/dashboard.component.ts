import { Component } from '@angular/core';

import { Project } from '../models/project';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

    // TODO: replace any type with a project model
    private projects: Project[];

    constructor() {
        // TODO: Eventually query for saved projects
        this.projects = [];
    }
}
