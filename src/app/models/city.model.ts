import { Feature, Point } from '@types/geojson';

export interface CityProperties {
    name: String;
    admin: String;
    population?: Number;
    map_cell: Point;
}

export interface City {
    id?: string;
    type: string;
    geometry: Point;
    properties: CityProperties;
}
