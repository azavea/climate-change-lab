import { Indicator } from './indicator.model';

export class Chart {
    indicator: Indicator;
    showSettings: boolean = false;
    showTrendline: boolean = false;
    showMinimum: boolean = false;
    minimumValue: number = 0;
    showMaximum: boolean = false;
    maximumValue: number = 0;

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
            maximumValue: this.maximumValue
        };
    }
}
