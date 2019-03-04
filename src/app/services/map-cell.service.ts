import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Point } from 'geojson';
import { Observable } from 'rxjs/Observable';

import { MapCell } from '../models/map-cell.model';
import { LabApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

@Injectable()
export class MapCellService {

    constructor(private apiHttp: LabApiHttp) {}

    nearest(point: Point, distance: number): Observable<MapCell[]> {
        const url = `${apiHost}/api/map-cell/${point.coordinates[1]}/${point.coordinates[0]}?distance=${distance}/`;
        return this.apiHttp.get(url)
        .map((resp) => {
            return resp.json() || [] as MapCell[];
        });
    }
}
