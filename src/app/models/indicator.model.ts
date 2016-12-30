export class Indicator {
    name: string;
    label: string;
    description: string;
    time_aggregation: string;
    variables: string[];
    available_units?: string[];
    default_units?: string;
    parameters?: any[];
    valid_aggregations?: string[];
}
