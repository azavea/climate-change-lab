import { Indicator } from './indicator.model';

export class Chart {
    indicator: Indicator;
    showSettings = false;
    showTrendline = false;
    showMinimum = false;
    minimumValue = 0;
    showMaximum = false;
    maximumValue = 0;
    unit: string;

    static fromJSON(object: Object) {
        return new this(object);
    }

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
            maximumValue: this.maximumValue,
            unit: this.unit
        };
    }
}
