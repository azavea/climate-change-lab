import { City } from './city.model';
import { Indicator } from './indicator.model';
import { ClimateModel } from './climate-model.model';
import { Scenario } from './scenario.model';

export interface IndicatorQueryOpts {
    indicator: Indicator;
    city: City;
    scenario: Scenario;
    params: {
        climateModels?: ClimateModel[];
        years?: string[];
        time_aggregation?: string;
        unit?: string;

        // threshold indicator parameters
        threshold?: Number;
        threshold_units?: string;
        threshold_comparator?: string;
    }
}
