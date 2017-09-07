import { Indicator } from './indicator.model';

export class Chart {
    indicator: Indicator;
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
            unit: this.unit
        };
    }
}
