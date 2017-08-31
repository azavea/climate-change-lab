import { ClimateModel } from './climate-model.model';
import { IndicatorQueryOpts } from './indicator-query-opts.model';

export interface ThresholdIndicatorQueryOpts extends IndicatorQueryOpts {
    params: {
        threshold: Number;
        threshold_units: string;
        threshold_comparator: string;

        // from base
        climateModels?: ClimateModel[];
        years?: string[];
        time_aggregation?: string;
        unit?: string;
    }
}
