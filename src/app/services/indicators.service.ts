import {Injectable} from '@angular/core';
import {Observable, Observer} from "rxjs";
import 'rxjs/Rx';

import { Indicator } from '../models/indicator.models';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from "../constants";
/*
 * Indicators Service
 * Returns climate indicators. Used by the sidebar.
 */

@Injectable()
export class IndicatorsService {
    private indicators: Observable<Indicator[]>;
    private indicatorObserver: Observer<Indicator[]>;

    constructor(private apiHttp: ApiHttp) {
        this.indicators = new Observable<Indicator[]>(observer => this.indicatorObserver = observer);
    }

    get() {
        return this.indicators;
    }

    public loadIndicators() {
        let url = apiHost + '/api/indicator/';
        this.apiHttp.get(url)
            .map(resp => resp.json())
            .subscribe(resp => this.indicatorObserver.next(resp.results || {} as Indicator[]));
    }
}
