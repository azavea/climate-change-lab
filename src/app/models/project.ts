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
    models: ClimateModel[] = [];
    charts: Chart[] = [];

    constructor(object: Object) {
        Object.assign(this, object);
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            visibility: this.visibility,
            city: this.city,
            scenario: this.scenario,
            models: this.models,
            charts: this.charts
        };
    }

    static fromJSON(object: Object) {
        return new this(object);
    }
}
