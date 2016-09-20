export class ChartData {
    indicator: string;
    data: Array<MultiDataPoint>;
    time_agg: Array<String>;
}

export class DataPoint {
    date: string;
    value: Number;
}

export class MultiDataPoint {
    date: string;
    values: {
        'avg': Number,
        'min': Number,
        'max': Number
    };
}

export class ClimateModel {
    name: string;
    selected: boolean;
}

export class Scenario {
    name: string;
    description: string;
}
