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
    public totalItems: number;
    public currentPage: number = 1;

    constructor(private projectService: ProjectService) {}

    ngOnInit() {
        this.getProjects();
        this.totalItems = this.projects.length;
        this.setPage();
    }

    public getProjects() {
        this.projects = this.projectService.list();
    }

    public deleteProject(project) {
        this.projectService.remove(project);
        this.getProjects();
        this.setPage();
    }

    public setPage() {
        this.pageOfProjects = this.projects.slice(0, 5);
    }

    public pageChanged(event:any):void {
        let index = event.itemsPerPage * (event.page - 1);
        this.pageOfProjects = this.projects.slice(index, index + event.itemsPerPage);
        console.log('Page changed to: ' + event.page);
        console.log('Number items per page: ' + event.itemsPerPage);
    };
}