import { ClimateModel } from './climate-model.model';

export interface IndicatorParams {
    climateModels?: ClimateModel[];
    years?: string[];
    time_aggregation?: string;
    unit?: string;
}
