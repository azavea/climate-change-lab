import { City } from './city.model';
import { Chart } from './chart.model';
import { ClimateModel } from './climate-model.model';
import { Scenario } from './scenario.model';

export enum ProjectVisibility {
    Private,
    Public
}

export class ProjectData {
    name: string;
    description: string;
    visibility: ProjectVisibility = ProjectVisibility.Private;
    city: City;
    scenario: Scenario;
    allModels = true;
    models: ClimateModel[] = [];
    charts: Chart[] = [];
    multiChartScrubber = false;

    static fromJSON(object: Object) {
        return new this(object);
    }

    constructor(object: Object) {
        Object.assign(this, object);
    }

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
}
