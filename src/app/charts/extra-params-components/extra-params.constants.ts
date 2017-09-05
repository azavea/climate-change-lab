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

const historicIndicatorNames = [
    'heat_wave_duration_index',
    'heat_wave_incidents'
];

// TODO: concat additional extra parameter names to this array for #203, #204, and #205
const extraParamsIndicatorNames = thresholdIndicatorNames;

export function isBasetempIndicator(indicatorName: string): boolean {
    return basetempIndicatorNames.indexOf(indicatorName) !== -1;
}

export function isHistoricIndicator(indicatorName: string): boolean {
    return historicIndicatorNames.indexOf(indicatorName) !== -1;
}

export function isThresholdIndicator(indicatorName: string): boolean {
    return thresholdIndicatorNames.indexOf(indicatorName) !== -1;
}

// TODO: use or remove this function
export function hasExtraParams(indicatorName: string): boolean {
    for (const extraParamName of extraParamsIndicatorNames) {
        if (indicatorName === extraParamName) {
            return true;
        }
    }
    return false;
}
