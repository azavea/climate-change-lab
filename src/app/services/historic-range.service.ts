import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { HistoricRange } from '../models/historic-range.model';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

/*
 * Historic Range Service
 * Returns available historic ranges from API
 */
@Injectable()
export class HistoricRangeService {

    constructor(private apiHttp: ApiHttp) {}

    public list(): Observable<HistoricRange[]> {
        const url = apiHost + '/api/historic-range/';
        return this.apiHttp.get(url).map(resp => resp.json() || [] as HistoricRange[]);
    }
}
