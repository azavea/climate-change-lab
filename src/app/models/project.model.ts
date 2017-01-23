import { ProjectData } from './project-data.model';

/* tslint:disable:variable-name */
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
/* tslint:enable:variable-name */

