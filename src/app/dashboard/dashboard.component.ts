import { Component, OnInit } from '@angular/core';

import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    private projects: Project[];
    private pageOfProjects: Project[];
    public currentPage: number = 1;
    public itemsPerPage: number = 5;

    constructor(private projectService: ProjectService) {}

    ngOnInit() {
        this.getProjects();
        this.setPage();
    }

    public getProjects() {
        this.projects = this.projectService.list();
    }

    public deleteProject(project) {
        // special handling for page with single project
        if (this.pageOfProjects.length == 1 && this.currentPage !==1) {
            // first switch to prior page else pagination breaks
            this.currentPage -= 1;
            this.setPage();
            // then remove project
            this.projectService.remove(project);
            this.getProjects();
        } else {
            this.projectService.remove(project);
            this.getProjects();
            this.setPage();
        }
    }

    public setPage(event?: any) {
        let page: number = event? event.page: this.currentPage;
        let index = this.itemsPerPage * (page - 1);
        this.pageOfProjects = this.projects.slice(index, index + this.itemsPerPage);
    }
}
