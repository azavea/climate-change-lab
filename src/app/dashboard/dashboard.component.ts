import { Component, OnInit } from '@angular/core';

import { Project } from '../models/project.model';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    private showDashboard: string = 'hide';     // Hide dashboard until projects loaded
    private projects: Project[] = [];
    private pageOfProjects: Project[] = [];
    public currentPage: number = 1;
    public itemsPerPage: number = 5;

    constructor(private projectService: ProjectService) {}

    ngOnInit() {
        this.projectService.list()
            .subscribe(data => {
                this.projects = data;
                this.setPage(this.currentPage);
                this.showDashboard = 'show';
            });
    }

    public getProjects() {
        this.projectService.list()
            .subscribe(data => this.projects = data);
    }

    public deleteProject(project: Project) {
        let projectIndex = this.projects.findIndex(p => p.id === project.id);
        // Ensure delete completes before requerying for all projects
        this.projectService.remove(project.id).flatMap(() => {
                return this.projectService.list();
            }).subscribe(data => {
                this.projects = data;
                let page = this.currentPage;
                // Switch to previous page if the deleted project is the last project and is also
                //  the last project on the current page
                if (this.projects.length % this.itemsPerPage === 0 &&
                    projectIndex === this.projects.length) {
                    page = page - 1;
                }
                this.setPage(page);
            });
    }

    public setPage(page: number) {
        this.currentPage = page < 1 ? 1 : page;
        let index = this.itemsPerPage * (page - 1);
        this.pageOfProjects = this.projects.slice(index, index + this.itemsPerPage);
    }
}
