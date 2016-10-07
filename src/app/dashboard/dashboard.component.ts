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
        this.setPage(this.currentPage);
    }

    public getProjects() {
        this.projects = this.projectService.list();
    }

    public deleteProject(project) {
        this.projectService.remove(project);
        this.getProjects();
        let page = this.currentPage;
        if (this.projects.length % this.itemsPerPage === 0) {
            page = page - 1;
        }
        this.setPage(page);
    }

    public setPage(page: number) {
        this.currentPage = page;
        let index = this.itemsPerPage * (page - 1);
        this.pageOfProjects = this.projects.slice(index, index + this.itemsPerPage);
    }
}
