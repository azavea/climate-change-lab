import { IndicatorQueryOpts } from './indicator-query-opts.model';

interface ThresholdIndicatorQueryOpts extends IndicatorQueryOpts {
    threshold: Number;
    threshold_units: string;
    threshold_comparator: string;
}