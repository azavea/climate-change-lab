import { City } from './city';
import { ClimateModel } from './climate-model';
import { Scenario } from './scenario';

export class Indicator {
    name: string;
    label: string;
    description: string;
    time_aggregation: string;
    variables: string[];
}

export interface IndicatorQueryOpts {
    indicator: Indicator;
    city: City;
    scenario: Scenario;
    climateModels?: ClimateModel[];
    years?: string[];
}
