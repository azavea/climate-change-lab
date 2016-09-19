export class ChartData {
  indicator: string;
  data: Array<DataPoint>;
  time_agg: Array<String>;
}

export class DataPoint {
  date: string;
  value: Number;
}
