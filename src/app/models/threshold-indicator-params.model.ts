import { IndicatorParams } from './indicator-params.model';

export interface ThresholdIndicatorParams extends IndicatorParams {
    threshold: Number;
    threshold_units: string;
    threshold_comparator: string;
}
