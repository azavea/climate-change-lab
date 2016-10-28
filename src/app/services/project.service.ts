import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { ProjectData, APIProject } from '../models/project';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from "../constants";

import * as _ from 'lodash';

@Injectable()
export class ProjectService {

    private projects: APIProject[] = [];

    constructor(private apiHttp: ApiHttp) {}

    add(project: APIProject): Observable<APIProject> {
        let url = `${apiHost}/api/project/`;
        return this.apiHttp.post(url, project).map(resp => resp.json() || {} as APIProject);
    }

    get(id: string): Observable<APIProject> {
        let url = `${apiHost}/api/project/${id}/`
        return this.apiHttp.get(url).map(resp => resp.json() || [] as APIProject[]);
    }

    list(): Observable<APIProject[]> {
        let url = `${apiHost}/api/project/`;
        return this.apiHttp.get(url)
            .map(resp => resp.json().results || [] as APIProject[]);
    }

    remove(id: string): Observable<Response> {
        let url = `${apiHost}/api/project/${id}/`;
        return this.apiHttp.delete(url);
    }

    update(project: APIProject): Observable<APIProject> {
        let url = `${apiHost}/api/project/${project.id}/`;
        return this.apiHttp.put(url, project).map(resp => resp.json() || {} as APIProject);
    }
}
