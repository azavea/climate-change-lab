import { IndicatorQueryOpts } from './indicator-query-opts.model';

export interface ThresholdIndicatorQueryOpts extends IndicatorQueryOpts {
    params: {
        threshold: Number;
        threshold_units: string;
        threshold_comparator: string;
    }
}
