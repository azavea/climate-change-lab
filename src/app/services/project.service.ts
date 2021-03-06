import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Project } from '../models/project.model';
import { ProjectData } from '../models/project-data.model';
import { LabApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

@Injectable()
export class ProjectService {

    constructor(private apiHttp: LabApiHttp) {}

    add(project: Project): Observable<Project> {
        const url = `${apiHost}/api/project/`;
        return this.apiHttp.post(url, project).map(resp => resp.json() || {} as Project);
    }

    get(id: string): Observable<Project> {
        const url = `${apiHost}/api/project/${id}/`;
        return this.apiHttp.get(url).map(resp => resp.json() || [] as Project[]);
    }

    list(): Observable<Project[]> {
        const url = `${apiHost}/api/project/`;
        return this.apiHttp.get(url)
            .map(resp => resp.json().results || [] as Project[]);
    }

    remove(id: string): Observable<Response> {
        const url = `${apiHost}/api/project/${id}/`;
        return this.apiHttp.delete(url);
    }

    update(project: Project): Observable<Project> {
        const url = `${apiHost}/api/project/${project.id}/`;
        return this.apiHttp.put(url, project).map(resp => resp.json() || {} as Project);
    }
}
