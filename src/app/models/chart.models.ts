export class ChartData {
  indicator: String;
  data: Array<DataPoint>;
}

export class DataPoint {
  date: String;
  value: Number;
}