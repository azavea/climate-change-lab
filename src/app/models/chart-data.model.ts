import { MultiDataPoint } from './multi-data-point.model';

export class ChartData {
  indicator: string;
  data: MultiDataPoint[];
  time_agg: string[];
  time_format: string;
}