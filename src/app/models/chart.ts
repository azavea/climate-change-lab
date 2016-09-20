import { Indicator } from './indicator.models';

export class Chart {
    indicator: Indicator;
    showSettings: boolean = false;
    showTrendline: boolean = false;
    showMinimum: boolean = false;
    minimumValue: number = 0;
    showMaximum: boolean = false;
    maximumValue: number = 0;

    constructor(object: Object) {
        Object.assign(this, object);
    }

    public toJSON() {
        return {
            indicator: this.indicator,
            showSettings: this.showSettings,
            showTrendline: this.showTrendline,
            showMinimum: this.showMinimum,
            showMaximum: this.showMaximum,
            minimumValue: this.minimumValue,
            maximumValue: this.maximumValue
        };
    }

    static fromJSON(object: Object) {
        return new this(object);
    }
}

export class ChartData {
  indicator: string;
  data: DataPoint[];
  time_agg: string[];
}

export class DataPoint {
  date: string;
  value: number;
}

export class MultiDataPoint {
    date: string;
    values: {
        'avg': Number,
        'min': Number,
        'max': Number
    };
}