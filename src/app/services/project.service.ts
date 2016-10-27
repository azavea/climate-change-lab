import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { Project, APIProject } from '../models/project';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from "../constants";

import * as _ from 'lodash';

@Injectable()
export class ProjectService {

    private projects: Project[] = [];

    constructor(private apiHttp: ApiHttp) {}

    add(project: Project) {
        this.projects.push(project);
    }

    get(id: string) {
        return this.projects.find(project => project.id === id);
    }

    list(): Observable<APIProject[]> {
        let url = apiHost + '/api/project/';
        return this.apiHttp.get(url)
            .map(resp => {
                resp = resp.json().results || [];
                return _.each(resp, project => project.project_data = JSON.parse(project.project_data));
            });
    }

    remove(project: Project) {
        this.projects = this.projects.filter(function(p) {
            return p.id !== project.id;
        });
    }

    update(project: Project) {
        let index = this.projects.findIndex(p => p.id === project.id);
        this.projects[index] = project;
    }
}