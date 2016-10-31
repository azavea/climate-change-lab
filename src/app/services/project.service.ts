import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { Project } from '../models/project.model';
import { ProjectData } from '../models/project-data.model';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from "../constants";

import * as _ from 'lodash';

@Injectable()
export class ProjectService {

    constructor(private apiHttp: ApiHttp) {}

    add(project: Project): Observable<Project> {
        let url = `${apiHost}/api/project/`;
        return this.apiHttp.post(url, project).map(resp => resp.json() || {} as Project);
    }

    get(id: string): Observable<Project> {
        let url = `${apiHost}/api/project/${id}/`
        return this.apiHttp.get(url).map(resp => resp.json() || [] as Project[]);
    }

    list(): Observable<Project[]> {
        let url = `${apiHost}/api/project/`;
        return this.apiHttp.get(url)
            .map(resp => resp.json().results || [] as Project[]);
    }

    remove(id: string): Observable<Response> {
        let url = `${apiHost}/api/project/${id}/`;
        return this.apiHttp.delete(url);
    }

    update(project: Project): Observable<Project> {
        let url = `${apiHost}/api/project/${project.id}/`;
        return this.apiHttp.put(url, project).map(resp => resp.json() || {} as Project);
    }
}
