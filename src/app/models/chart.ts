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
  data: MultiDataPoint[];
  time_agg: string[];
  time_format: string;
}

export class DataPoint {
    date: Date;
    value: number;
}

export class MultiDataPoint {
    date: Date;
    values: {
        'avg': number,
        'min': number,
        'max': number
    };
}