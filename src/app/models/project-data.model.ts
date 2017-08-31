import { City } from './city.model';
import { Chart } from './chart.model';
import { ClimateModel } from './climate-model.model';
import { Scenario } from './scenario.model';

export class ProjectData {
    name: string;
    description: string;
    city: City;
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
            models: this.models,
            charts: this.charts,
            extraParams: this.extraParams
        };
    }
}
