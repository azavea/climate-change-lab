// Provides utility methods for checking which sort of extra parameters a given indicator uses.

const thresholdIndicatorNames = [
    'max_temperature_threshold',
    'min_temperature_threshold',
    'precipitation_threshold'
];

const basetempIndicatorNames = [
    'cooling_degree_days',
    'heating_degree_days'
];

// TODO: concat additional extra parameter names to this array for #203, #204, and #205
const extraParamsIndicatorNames = thresholdIndicatorNames;

export function isBasetempIndicator(indicatorName: string): boolean {
    for (const basetempName of basetempIndicatorNames) {
        if (indicatorName === basetempName) {
            return true;
        }
    }
    return false;
}

export function isThresholdIndicator(indicatorName: string): boolean {
    for (const thresholdName of thresholdIndicatorNames) {
        if (indicatorName === thresholdName) {
            return true;
        }
    }
    return false;
}

export function hasExtraParams(indicatorName: string): boolean {
    for (const extraParamName of extraParamsIndicatorNames) {
        if (indicatorName === extraParamName) {
            return true;
        }
    }
    return false;
}
