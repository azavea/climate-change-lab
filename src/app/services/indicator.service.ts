import {Injectable} from '@angular/core';
import {Observable, Observer} from "rxjs";
import 'rxjs/Rx';

import { Indicator } from '../models/indicator.models';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from "../constants";
/*
 * Indicator Service
 * Returns climate indicators. Used by the sidebar.
 */

@Injectable()
export class IndicatorService {
    constructor(private apiHttp: ApiHttp) {}

    public list(): Observable<Indicator[]> {
        let url = apiHost + '/api/indicator/';
        return this.apiHttp.get(url)
            .map(resp => resp.json().results || []);
    }
}
