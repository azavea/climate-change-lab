import { City } from './city.model';
import { Indicator } from './indicator.model';
import { IndicatorParams } from './indicator-params.model';
import { ClimateModel } from './climate-model.model';
import { Scenario } from './scenario.model';

export interface IndicatorQueryOpts {
    indicator: Indicator;
    city: City;
    scenario: Scenario;
    params: IndicatorParams;
}
