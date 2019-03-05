import { Point } from 'geojson';

export interface ProximityProperties {
    ocean: boolean;
}

/* tslint:disable:variable-name */
export interface MapCellProperties {
    datasets: string[];
    distance_meters: number;
    proximity: ProximityProperties;
}
/* tslint:enable:variable-name */

export interface MapCell {
    type: string;
    geometry: Point;
    properties: MapCellProperties;
}
