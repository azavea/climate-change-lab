import { ProjectData } from './project-data.model';

export class Project {
    id: string;
    created: string;
    modified: string;
    project_data: ProjectData;

    constructor(object: Object) {
        Object.assign(this, object);
        if (!this.project_data) {
            this.project_data = new ProjectData({});
        }
    }
}
