export class ChartData {
  indicator: String;
  data: Array<Object<DataPoint>>;
}

export class DataPoint {
  date: String;
  value: Number;
}