export class ChartData {
  indicator: string;
  data: Array<DataPoint>;
  time_agg: Array<String>;
}

export class DataPoint {
  date: string;
  value: Number;
}

export class ClimateModel {
    name: string;
    selected: boolean;
}

export class Scenario {
    name: string;
    description: string;
}
