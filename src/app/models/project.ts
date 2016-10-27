import { City } from './city';
import { Chart } from './chart';
import { ClimateModel } from './climate-model';
import { Scenario } from './scenario';

export enum ProjectVisibility {
    Private,
    Public
}

export class APIProject {
    id: string;
    created: string;
    modified: string;
    project_data: Project;
}

export class Project {
    name: string;
    description: string;
    visibility: ProjectVisibility = ProjectVisibility.Private;
    city: City;
    scenario: Scenario;
    allModels: boolean = true;
    models: ClimateModel[] = [];
    charts: Chart[] = [];
    multiChartScrubber: boolean = false;

    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            visibility: this.visibility,
            city: this.city,
            scenario: this.scenario,
            allModels: this.allModels,
            models: this.models,
            charts: this.charts,
            multiChartScrubber: this.multiChartScrubber
        };
    }

    static fromJSON(object: Object) {
        return new this(object);
    }
}
