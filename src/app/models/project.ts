import { City } from './city';
import { Chart } from './chart';
import { ClimateModel } from './climate-model';
import { Scenario } from './scenario';

export enum ProjectVisibility {
    Private,
    Public
}

export class Project {
    id: string;
    name: string;
    description: string;
    visibility: ProjectVisibility = ProjectVisibility.Private;
    city: City;
    scenario: Scenario;
    allModels: boolean = true;
    models: ClimateModel[] = [];
    charts: Chart[] = [];

    constructor(object: Object) {
        Object.assign(this, object);
        if (!this.id) {
            this.id = this.generateUUID();
        }
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            visibility: this.visibility,
            city: this.city,
            scenario: this.scenario,
            allModels: this.allModels,
            models: this.models,
            charts: this.charts
        };
    }

    static fromJSON(object: Object) {
        return new this(object);
    }

    private generateUUID(): string {
        // TODO: Remove when UUID generated via POST to API
        // Pulled this temporary implementation from:
        //  https://stackoverflow.com/a/2117523
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}
