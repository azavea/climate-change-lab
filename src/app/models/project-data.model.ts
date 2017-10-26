import { City, Chart, ClimateModel, Dataset, Scenario } from 'climate-change-components';

export class ProjectData {
    name: string;
    description: string;
    city: City;
    dataset: Dataset;
    scenario: Scenario;
    models: ClimateModel[] = [];
    charts: Chart[] = [];
    extraParams?: object;

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
            city: this.city,
            scenario: this.scenario,
            dataset: this.dataset,
            models: this.models,
            charts: this.charts,
            extraParams: this.extraParams
        };
    }
}
