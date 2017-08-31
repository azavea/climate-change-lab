import { ClimateModel } from './climate-model.model';
import { TimeAggParam } from './time-agg-param.enum';

export interface IndicatorParams {
    climateModels?: ClimateModel[];
    years?: string[];
    time_aggregation?: TimeAggParam;
    agg?: string;
    unit?: string;
}
