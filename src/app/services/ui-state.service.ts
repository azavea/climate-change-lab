import { Injectable } from '@angular/core';

import { Chart } from '../models/chart';
import { Project } from '../models/project';

@Injectable()
export class UIStateService {

    private localStorage: Storage = window.localStorage;
    private state: Project[] = [];

    constructor() {}

    public addChart(chart: Chart) {

    }

    public addProject(project: Project) {

    }

    public getProject(projectId: string) : Project {
        return null;
    }

    public deleteProject(project: Project) {

    }

    public list(): Project[] {
        return [];
    }
}