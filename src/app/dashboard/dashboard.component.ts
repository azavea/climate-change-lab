import { Component, OnInit } from '@angular/core';

import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    private projects: Project[];

    constructor(private projectService: ProjectService) {}

    ngOnInit() {
        this.getProjects();
    }

    public getProjects() {
        this.projects = this.projectService.list();
    }

    public deleteProject(project) {
        this.projectService.remove(project);
        this.getProjects();
    }
}